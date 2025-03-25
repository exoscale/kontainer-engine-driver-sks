/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
// https://github.com/rancher/ui/blob/master/lib/shared/addon/mixins/cluster-driver.js
import ClusterDriver from 'shared/mixins/cluster-driver';
import { ajaxPromise } from '@rancher/ember-api-store/utils/ajax-promise';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

const languages = {
  'en-us': {
    'clusterNew': {
      'exoscalesks': {
        //TODO(pej): Add SKS nodepool Taints

        'accessConfig': {
          'next': 'Proceed to Cluster Configuration',
          'loading': 'Verifying your API Keys',
          'title': 'Exoscale Account API Keys',
          'description': 'Provide us API Keys that will be used to access your Exoscale account'
        },
        "apikey": {
          "label": "API Key",
          "placeholder": "The API key to use for accessing your Exoscale account",
          "required": "API Key is required",
          "invalid": "API Key is invalid"
        },
        "apisecret": {
          "label": "API Secret Key",
          "placeholder": "The API Secret Key to use for accessing your Exoscale account",
          "required": "API Secret Key is required",
          "invalid": "API Secret Key is invalid"
        },
        'clusterConfig': {
          'next': 'Proceed to Node pool selection',
          'loading': 'Saving your cluster configuration',
          'title': 'Cluster Configuration',
          'description': 'Configure your cluster'
        },
        "level": {
          "label": "Level",
          "placeholder": "Select a level for your cluster",
          "required": "Level is required"
        },
        "zone": {
          "label": "Zone",
          "placeholder": "Select a zone for your cluster",
          "required": "Zone is required"
        },
        "kubernetesVersion": {
          "label": "Kubernetes Version",
          "placeholder": "Select a kubernetes version for your cluster",
          "required": "Kubernetes Version is required"
        },
        "nodePoolConfig": {
          'next': 'Create',
          'loading': 'Creating your cluster',
          'title': 'Node Pool Configuration',
          'description': 'Configure your desired node pools',
          'update': "Update"
        },
        "selectedNodePoolType": {
          "label": "Select type",
          "placeholder": "Select a node pool type"
        },
        "nodePools": {
          "label": "Selected Node Pools",
          "required": "Please add at least one node pool",
          "empty": "Sorry, node pool list is empty",
          "sizeError": "All node size must be greater than 0.",
          "diskSizeError": "All node disk size must be greater or equal than 50GiB.",
          "placeholder": "Please select a node type to add"
        }
      }
    }
  }
};

/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed = Ember.computed;
const observer = Ember.observer;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service;
const next = Ember.run.next;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName: '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig', // 'googleKubernetesEngineConfig'
  app: service(),
  router: service(),
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  session: service(),
  intl: service(),
  exoscale: service(),

  step: 1,
  lanChanged: null,
  refresh: false,
  exoscaleApi: 'api-ch-gva-2.exoscale.com/v2',

  init() {
    /*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this, 'layout', template);

    this._super(...arguments);
    /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

    // for languages
    const lang = get(this, 'session.language');
    get(this, 'intl.locale');
    this.loadLanguage(lang);

    let config = get(this, 'config');
    let configField = get(this, 'configField');

    // for node pools
    set(this, "selectedNodePoolType", "")
    set(this, "selectedNodePoolObj", {});
    set(this, "selectedNodePoolList", this.prefillSelectedNodePoolList());

    if (!config) {
      config = this.get('globalStore').createRecord({
        type: configField,
        name: "",
        providerName: "",
        description: "",
        apiKey: "",
        secretKey: "",
        zone: "",
        level: "",
        kubernetesVersion: "",
        nodePools: []
      });

      set(this, 'cluster.%%DRIVERNAME%%EngineConfig', config);
    }
  },

  config: alias('cluster.%%DRIVERNAME%%EngineConfig'),

  actions: {
    verifyAccessKeys(cb) {
      const apikey = get(this, "cluster.%%DRIVERNAME%%EngineConfig.apikey");
      const secret = get(this, "cluster.%%DRIVERNAME%%EngineConfig.apisecret");
      const intl = get(this, "intl");

      if (!apikey || !secret) {
        this.set("errors", [
          intl.t("clusterNew.exoscalesks.apikey.required"),
          intl.t("clusterNew.exoscalesks.apisecret.required"),
        ]);
        cb(false);
        return;
      }

      const levels = [
        { id: "starter" },
        { id: "pro" },
      ];

      const handleError = (err) => {
        this.set("errors", [`Error received from Exoscale: ${err.message}`]);
        cb(false);
      };

      Promise.all([
        this.apiRequest("zone", "GET", {}, "", apikey, secret)
          .then((response) => response.zones.map((zone) => ({ id: zone.name }))),
        this.apiRequest("sks-cluster-version", "GET", {}, "", apikey, secret)
          .then((response) => response["sks-cluster-versions"].map((version) => ({ id: version }))),
        this.apiRequest("instance-type", "GET", {}, "", apikey, secret)
          .then((response) => response["instance-types"]
            .filter((instanceType) => instanceType.size !== "tiny" && instanceType.size !== "micro")
            .map((instanceType) => ({
              id: instanceType.id,
              label: `${instanceType.family}.${instanceType.size}`,
              diskSize: 50,
            })))
      ])
        .then(([zones, k8sVersions, nodeTypes]) => {
          this.setProperties({
            errors: [],
            step: 2,
            zones,
            levels,
            nodeTypes,
            k8sVersions,
          });
          cb(true);
        })
        .catch(handleError);
    },
    verifyClusterConfig(cb) {
      const errors = [];
      const intl = get(this, 'intl');

      const zone = get(this, "cluster.%%DRIVERNAME%%EngineConfig.zone");
      if (!zone) {
        const zones = get(this, "zones");
        if (zones && zones.length > 0) {
          const defaultZone = zones[0].id;
          set(this, "cluster.%%DRIVERNAME%%EngineConfig.zone", defaultZone);
        } else {
          errors.push(intl.t("clusterNew.exoscalesks.zone.required"));
          set(this, "errors", errors);
        }
      }

      const kubernetesVersion = get(this, "cluster.%%DRIVERNAME%%EngineConfig.kubernetesVersion");
      if (!kubernetesVersion) {
        const k8sVersions = get(this, "k8sVersions");
        if (k8sVersions && k8sVersions.length > 0) {
          const defaultK8sVersion = k8sVersions[0].id;
          set(this, "cluster.%%DRIVERNAME%%EngineConfig.kubernetesVersion", defaultK8sVersion);
        } else {
          errors.push(intl.t("clusterNew.exoscalesks.kubernetesVersion.required"));
          set(this, "errors", errors);
        }
      }

      const level = get(this, "cluster.%%DRIVERNAME%%EngineConfig.level");
      if (!level) {
        const levels = get(this, "levels");
        if (levels && levels.length > 0) {
          const defaultLevel = levels[0].id;
          set(this, "cluster.%%DRIVERNAME%%EngineConfig.level", defaultLevel);
        } else {
          errors.push(intl.t("clusterNew.exoscalesks.level.required"));
          set(this, "errors", errors);
        }
      }

      if (errors.length > 0) {
        cb(false);
        return
      }

      set(this, "step", 3);
      cb(true);
    },

    createCluster(cb) {
      if (this.verifyNodePoolConfig()) {
        this.send("driverSave", cb);
      } else {
        cb(false);
      }
    },

    updateCluster(cb) {
      if (this.verifyNodePoolConfig()) {
        this.send("driverSave", cb);
      } else {
        cb(false);
      }
    },

    cancelFunc(cb) {
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
      cb(true);
    },

    // for node pools
    addSelectedNodePool() {
      const selectedNodePoolObj = get(this, "selectedNodePoolObj");
      const selectedNodePoolList = get(this, "selectedNodePoolList");

      if (selectedNodePoolObj.id) {
        // add to list
        selectedNodePoolList.pushObject(selectedNodePoolObj);

        // clear selected
        set(this, "selectedNodePoolType", "");
        set(this, "selectedNodePoolObj", {});
      }
    },
    deleteNodePool(id) {
      const selectedNodePoolList = get(this, "selectedNodePoolList");

      set(this, "selectedNodePoolList", selectedNodePoolList.filter(n => n.id !== id))
    }
  },


  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors') || [];
    if (!get(this, 'cluster.name')) {
      errors.push('Name is required');
    }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if (get(errors, 'length')) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here

  // For languages
  languageChanged: observer('intl.locale', function () {
    const lang = get(this, 'intl.locale');

    if (lang) {
      this.loadLanguage(lang[0]);
    }
  }),
  loadLanguage(lang) {
    const translation = languages[lang] || languages['en-us'];
    const intl = get(this, 'intl');

    intl.addTranslations(lang, translation);
    intl.translationsFor(lang);
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },

  clusterNameChanged: observer('cluster.name', function () {
    const clusterName = get(this, 'cluster.name');
    set(this, 'cluster.%%DRIVERNAME%%EngineConfig.name', clusterName);
    set(this, 'cluster.%%DRIVERNAME%%EngineConfig.providerName', clusterName);
  }),
  clusterDescriptionChanged: observer('cluster.description', function () {
    const clusterDescription = get(this, 'cluster.description');
    set(this, 'cluster.%%DRIVERNAME%%EngineConfig.description', clusterDescription);
  }),

  // For Access Token step
  accessConfigTitle: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.accessConfig.title");
  }),
  accessConfigDetail: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.accessConfig.description");
  }),

  // For Cluster Configuration Step
  clusterConfigTitle: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.clusterConfig.title");
  }),
  clusterConfigDetail: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.clusterConfig.description");
  }),

  // for zone choises
  zoneChoises: computed('zones', async function () {
    const ans = await get(this, "zones");
    return ans.map(e => {
      return {
        label: e.id,
        value: e.id
      }
    });
  }),

  // for level choises
  levelChoises: computed('levels', async function () {
    const ans = await get(this, "levels");
    return ans.map(e => {
      return {
        label: e.id,
        value: e.id
      }
    });
  }),

  // for level choises
  k8sVersionChoises: computed('k8sVersions', async function () {
    const ans = await get(this, "k8sVersions");
    return ans.map(e => {
      return {
        label: e.id,
        value: e.id
      }
    });
  }),

  // For Node Pool Configuration Step
  nodePoolConfigTitle: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.nodePoolConfig.title");
  }),
  nodePoolConfigDetail: computed('intl.locale', 'langChanged', function () {
    return get(this, 'intl').t("clusterNew.exoscalesks.nodePoolConfig.description");
  }),

  // for node pool choises
  nodePoolChoises: computed("nodeTypes.[]", "selectedNodePoolList.[]", async function () {
    const intl = get(this, 'intl');
    const ans = await get(this, "nodeTypes");
    const filteredAns = ans.filter(np => {
      // filter out the already selected node pools
      const selectedNodePoolList = get(this, "selectedNodePoolList");
      const fnd = selectedNodePoolList.find(snp => snp.id === np.id);
      if (fnd) return false;
      else return true;
    }).map(np => {
      return {
        label: np.label,
        value: np.id
      };
    });
    return [{ label: intl.t("clusterNew.exoscalesks.nodePools.placeholder"), value: "" }, ...filteredAns];
  }),
  setSelectedNodePoolObj: observer("selectedNodePoolType", async function () {
    const nodePoolTypes = await get(this, "nodeTypes");
    const selectedNodePoolType = get(this, "selectedNodePoolType");

    if (selectedNodePoolType) {
      const ans = nodePoolTypes.find(np => np.id === selectedNodePoolType);
      set(this, "selectedNodePoolObj", { ...ans, size: 1, diskSize: 50 });
    } else set(this, "selectedNodePoolObj", {});
  }),
  setNodePools: observer("selectedNodePoolList.@each.{size,diskSize}", function () {
    const selectedNodePoolList = get(this, "selectedNodePoolList");
    const nodePools = selectedNodePoolList.map(np => {
      return `${np.id}=${np.size},${np.diskSize}`;
    });
    set(this, "cluster.%%DRIVERNAME%%EngineConfig.nodePools", nodePools);
  }),

  verifyNodePoolConfig() {
    const intl = get(this, 'intl');
    const selectedNodePoolList = get(this, "selectedNodePoolList");
    const errors = [];

    if (selectedNodePoolList.length === 0) {
      errors.push(intl.t("clusterNew.exoscalesks.nodePools.required"));
      set(this, "errors", errors);
      return false;
    } else {
      const fnd = selectedNodePoolList.find(np => np.size <= 0);
      if (fnd) {
        errors.push(intl.t("clusterNew.exoscalesks.nodePools.sizeError"));
        set(this, "errors", errors);
        return false;
      }
      const fndDiskSize = selectedNodePoolList.find(np => np.diskSize < 50);
      if (fndDiskSize) {
        errors.push(intl.t("clusterNew.exoscalesks.nodePools.diskSizeError"));
        set(this, "errors", errors);
        return false;
      }
      return true;
    }
  },

  // to prefil selected node pool list for edit mode
  prefillSelectedNodePoolListObserver: observer("nodeTypes.[]", function () {
    this.prefillSelectedNodePoolList();
  }),

  async prefillSelectedNodePoolList() {
    const nodePools = get(this, "cluster.%%DRIVERNAME%%EngineConfig.nodePools");
    const nodePoolTypes = await get(this, "nodeTypes");

    if (nodePools && nodePools.length) {
      set(this, "selectedNodePoolList", nodePools.map(np => {
        const [npId, config] = np.split("=");
        const [size, diskSize] = config.split(",");
        const fnd = Array.isArray(nodePoolTypes) ? nodePoolTypes.find(npt => npt.id === npId) : null;
        if (fnd) {
          return { ...fnd, size: parseInt(size, 10), diskSize: parseInt(diskSize, 10) };
        } else {
          return { id: npId, size: parseInt(size, 10), diskSize: parseInt(diskSize, 10), label: npId };
        }
      }));
    } else {
      set(this, "selectedNodePoolList", []);
    }
  },

  apiRequest(endpoint, method = 'GET', params = {}, body = '', apikey, secret) {
    const baseUrl = `${get(this, 'app.proxyEndpoint')}/${this.exoscaleApi}`;
    const url = `${baseUrl}/${endpoint}`;
    const expires = Math.floor(Date.now() / 1000) + 600; // Expiration time (10 minutes from now)

    const sortedParams = Object.keys(params).sort();
    const queryString = new URLSearchParams(params).toString();
    const queryValues = sortedParams.map((key) => params[key]).join('');

    const requestBody = body ? JSON.stringify(body) : '';

    const message = [
      `${method} /v2/${endpoint}`,
      requestBody,
      queryValues,
      '',
      expires.toString(),
    ].join('\n');

    const signature = AWS.util.crypto.hmac(secret, message, 'base64', 'sha256');

    const signedQueryArgs = sortedParams.length > 0 ? `signed-query-args=${sortedParams.join(';')},` : '';
    const authorizationHeader = `EXO2-HMAC-SHA256 credential=${apikey},${signedQueryArgs}expires=${expires},signature=${signature}`;

    const options = {
      url: queryString ? `${url}?${queryString}` : url,
      method,
      dataType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Auth-Header': authorizationHeader,
      },
      data: method === 'POST' ? requestBody : undefined,
    };

    return ajaxPromise(options, true)
      .then((response) => response)
      .catch((err) => {
        const errorCode = err?.xhr?.status || 'Unknown';
        const errorResponse = err?.xhr?.responseText || 'No response body';
        throw new Error(`Exoscale API Error (Code: ${errorCode}): ${errorResponse}`);
      });
  }
});
