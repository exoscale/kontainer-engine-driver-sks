"use strict";

define("shared/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/component", ["exports", "shared/mixins/cluster-driver", "@rancher/ember-api-store/utils/ajax-promise"], function (exports, _clusterDriver, _ajaxPromise) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const LAYOUT = 'PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjYWNjb3JkaW9uLWxpc3Qgc2hvd0V4cGFuZEFsbD1mYWxzZSBhcyB8YWwgZXhwYW5kRm58fX0KICAgIHt7I2lmIChlcSBzdGVwIDEpfX0KICAgICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICAgIHRpdGxlPWFjY2Vzc0NvbmZpZ1RpdGxlCiAgICAgICAgZGV0YWlsPWFjY2Vzc0NvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xMiI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYXBpa2V5LmxhYmVsIn19CiAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5AZXhvc2NhbGUvdWktY2x1c3Rlci1kcml2ZXItc2tzRW5naW5lQ29uZmlnLmFwaWtleQogICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7aW5wdXQKICAgICAgICAgICAgICAgIG5hbWU9ImFwaWtleSIKICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSh0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmFwaWtleS5wbGFjZWhvbGRlciIpCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLkBleG9zY2FsZS91aS1jbHVzdGVyLWRyaXZlci1za3NFbmdpbmVDb25maWcuYXBpa2V5CiAgICAgICAgICAgICAgfX0KICAgICAgICAgICAge3svaW5wdXQtb3ItZGlzcGxheX19CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTEyIj4KICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlzZWNyZXQubGFiZWwifX0KICAgICAgICAgICAgICB7e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAge3sjaW5wdXQtb3ItZGlzcGxheQogICAgICAgICAgICAgIGVkaXRhYmxlPXRydWUKICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLkBleG9zY2FsZS91aS1jbHVzdGVyLWRyaXZlci1za3NFbmdpbmVDb25maWcuYXBpc2VjcmV0CiAgICAgICAgICAgIH19CiAgICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgICAgdHlwZT0icGFzc3dvcmQiCiAgICAgICAgICAgICAgICBuYW1lPSJhcGlzZWNyZXQiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlzZWNyZXQucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5AZXhvc2NhbGUvdWktY2x1c3Rlci1kcml2ZXItc2tzRW5naW5lQ29uZmlnLmFwaXNlY3JldAogICAgICAgICAgICAgIH19CiAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgIHt7L2FjY29yZGlvbi1saXN0LWl0ZW19fQogICAgICB7e3RvcC1lcnJvcnMgZXJyb3JzPWVycm9yc319CiAgICAgIHt7c2F2ZS1jYW5jZWwKICAgICAgICBidG5MYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hY2Nlc3NDb25maWcubmV4dCIKICAgICAgICBzYXZpbmdMYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hY2Nlc3NDb25maWcubG9hZGluZyIKICAgICAgICBzYXZlPSJ2ZXJpZnlBY2Nlc3NLZXlzIgogICAgICAgIGNhbmNlbD1jbG9zZQogICAgICB9fQogICAge3tlbHNlIGlmIChlcSBzdGVwIDIpfX0KICAgICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICAgIHRpdGxlPWNsdXN0ZXJDb25maWdUaXRsZQogICAgICAgIGRldGFpbD1jbHVzdGVyQ29uZmlnRGV0YWlsCiAgICAgICAgZXhwYW5kQWxsPWV4cGFuZEFsbAogICAgICAgIGV4cGFuZD0oYWN0aW9uIGV4cGFuZEZuKQogICAgICAgIGV4cGFuZE9uSW5pdD10cnVlCiAgICAgIH19CiAgICAgICAge3sjaWYgKGVxIG1vZGUgIm5ldyIpfX0KICAgICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy56b25lLmxhYmVsIn19CiAgICAgICAgICAgICAgICB7e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICAgIGVkaXRhYmxlPXRydWUKICAgICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuQGV4b3NjYWxlL3VpLWNsdXN0ZXItZHJpdmVyLXNrc0VuZ2luZUNvbmZpZy56b25lCiAgICAgICAgICAgICAgfX0KICAgICAgICAgICAgICAgIHt7bmV3LXNlbGVjdAogICAgICAgICAgICAgICAgICBjbGFzcz0iZm9ybS1jb250cm9sIgogICAgICAgICAgICAgICAgICBjb250ZW50PXpvbmVDaG9pc2VzCiAgICAgICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuQGV4b3NjYWxlL3VpLWNsdXN0ZXItZHJpdmVyLXNrc0VuZ2luZUNvbmZpZy56b25lCiAgICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmt1YmVybmV0ZXNWZXJzaW9uLmxhYmVsIn19CiAgICAgICAgICAgICAgICB7e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICAgIGVkaXRhYmxlPXRydWUKICAgICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuQGV4b3NjYWxlL3VpLWNsdXN0ZXItZHJpdmVyLXNrc0VuZ2luZUNvbmZpZy5rdWJlcm5ldGVzVmVyc2lvbgogICAgICAgICAgICAgIH19CiAgICAgICAgICAgICAgICB7e25ldy1zZWxlY3QKICAgICAgICAgICAgICAgICAgY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgICAgY29udGVudD1rOHNWZXJzaW9uQ2hvaXNlcwogICAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLkBleG9zY2FsZS91aS1jbHVzdGVyLWRyaXZlci1za3NFbmdpbmVDb25maWcua3ViZXJuZXRlc1ZlcnNpb24KICAgICAgICAgICAgICAgIH19CiAgICAgICAgICAgICAge3svaW5wdXQtb3ItZGlzcGxheX19CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAge3svaWZ9fQogICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5sZXZlbC5sYWJlbCJ9fQogICAgICAgICAgICAgIHt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5CiAgICAgICAgICAgICAgZWRpdGFibGU9dHJ1ZQogICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuQGV4b3NjYWxlL3VpLWNsdXN0ZXItZHJpdmVyLXNrc0VuZ2luZUNvbmZpZy5sZXZlbAogICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7bmV3LXNlbGVjdAogICAgICAgICAgICAgICAgY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIGNvbnRlbnQ9bGV2ZWxDaG9pc2VzCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLkBleG9zY2FsZS91aS1jbHVzdGVyLWRyaXZlci1za3NFbmdpbmVDb25maWcubGV2ZWwKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIHt7IS0tIFRPRE8ocGVqKSBBREQgVEFJTlRTIEhFUkUgLS19fQoKICAgICAgICAgIHt7IS0tIDxkaXYgY2xhc3M9ImhlYWRlciBtdC0yMCBjbGVhcmZpeCI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9InB1bGwtbGVmdCI+CiAgICAgICAgICAgICAgPGgyIGNsYXNzPSJtYi0wIj4KICAgICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5sYWJlbHMubGFiZWwifX0KICAgICAgICAgICAgICA8L2gyPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNSI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MubGFiZWxzLm5ld0xhYmVsIn19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkgZWRpdGFibGU9dHJ1ZSB2YWx1ZT1uZXdMYWJlbH19CiAgICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgICAgdHlwZT0idGV4dCIKICAgICAgICAgICAgICAgIG5hbWU9ImxhYmVscyIKICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSh0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmxhYmVscy5wbGFjZWhvbGRlciIpCiAgICAgICAgICAgICAgICB2YWx1ZT1uZXdMYWJlbAogICAgICAgICAgICAgIH19CiAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xIj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0iYnRuIGJnLXByaW1hcnkgYnRuLXNtIG10LTMwIiB7e2FjdGlvbiAiYWRkTmV3TGFiZWwifX0+CiAgICAgICAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi1wbHVzIj48L2k+CiAgICAgICAgICAgIDwvYnV0dG9uPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgPGRpdiBjbGFzcz0ic2tzLWxhYmVscyI+CiAgICAgICAgICAgICAge3sjZWFjaCBjbHVzdGVyLkBleG9zY2FsZS91aS1jbHVzdGVyLWRyaXZlci1za3NFbmdpbmVDb25maWcubGFiZWxzIGFzIHxsYWJlbCBsYWJlbElkeHx9fQogICAgICAgICAgICAgICAgPCEtLSAgICAgc2luZ2xlIGxhYmVsIHN0YXJ0IC0tPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ic2tzLWxhYmVsIGJnLXByaW1hcnkiPgogICAgICAgICAgICAgICAgICA8c3Bhbj4KICAgICAgICAgICAgICAgICAgICB7e2xhYmVsfX0KICAgICAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICAgICAgICA8YnV0dG9uCiAgICAgICAgICAgICAgICAgICAgY2xhc3M9InNrcy1kZWxldGUgYmctZXJyb3IiCiAgICAgICAgICAgICAgICAgICAge3thY3Rpb24gImRlbGV0ZUxhYmVsIiBsYWJlbElkeH19CiAgICAgICAgICAgICAgICAgID4KICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0iaWNvbiBpY29uLXRyYXNoIj48L2k+CiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8IS0tICAgICBzaW5nbGUgbGFiZWwgZW5kICAtLT4KICAgICAgICAgICAgICB7e2Vsc2V9fQogICAgICAgICAgICAgICAgTm8gbGFiZWxzIGFkZGVkCiAgICAgICAgICAgICAge3svZWFjaH19CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+IC0tfX0KICAgICAgICA8L2Rpdj4KICAgICAge3svYWNjb3JkaW9uLWxpc3QtaXRlbX19CiAgICAgIHt7dG9wLWVycm9ycyBlcnJvcnM9ZXJyb3JzfX0KICAgICAge3tzYXZlLWNhbmNlbAogICAgICAgIGJ0bkxhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmNsdXN0ZXJDb25maWcubmV4dCIKICAgICAgICBzYXZpbmdMYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5jbHVzdGVyQ29uZmlnLmxvYWRpbmciCiAgICAgICAgc2F2ZT0idmVyaWZ5Q2x1c3RlckNvbmZpZyIKICAgICAgICBjYW5jZWw9Y2xvc2UKICAgICAgfX0KICAgIHt7ZWxzZSBpZiAoZXEgc3RlcCAzKX19CiAgICAgIHt7I2FjY29yZGlvbi1saXN0LWl0ZW0KICAgICAgICB0aXRsZT1ub2RlUG9vbENvbmZpZ1RpdGxlCiAgICAgICAgZGV0YWlsPW5vZGVQb29sQ29uZmlnRGV0YWlsCiAgICAgICAgZXhwYW5kQWxsPWV4cGFuZEFsbAogICAgICAgIGV4cGFuZD0oYWN0aW9uIGV4cGFuZEZuKQogICAgICAgIGV4cGFuZE9uSW5pdD10cnVlCiAgICAgIH19CiAgICAgICAge3shIHNlbGVjdCBub2RlIHBvb2wgfX0KICAgICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNCI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Muc2VsZWN0ZWROb2RlUG9vbFR5cGUubGFiZWwifX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAge3sjaW5wdXQtb3ItZGlzcGxheSBlZGl0YWJsZT10cnVlIHZhbHVlPXNlbGVjdGVkTm9kZVBvb2xUeXBlfX0KICAgICAgICAgICAgICB7e25ldy1zZWxlY3QKICAgICAgICAgICAgICAgIGNsYXNzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBjb250ZW50PW5vZGVQb29sQ2hvaXNlcwogICAgICAgICAgICAgICAgdmFsdWU9c2VsZWN0ZWROb2RlUG9vbFR5cGUKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMSI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAgRGlzayBTaXplOgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPElucHV0CiAgICAgICAgICAgICAgQHR5cGU9Im51bWJlciIKICAgICAgICAgICAgICBAbWluPSI1MCIKICAgICAgICAgICAgICBAdmFsdWU9e3t0aGlzLnNlbGVjdGVkTm9kZVBvb2xPYmouZGlza1NpemV9fQogICAgICAgICAgICAvPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xIj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICBTaXplOgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPElucHV0CiAgICAgICAgICAgICAgQHR5cGU9Im51bWJlciIKICAgICAgICAgICAgICBAbWluPSIxIgogICAgICAgICAgICAgIEB2YWx1ZT17e3RoaXMuc2VsZWN0ZWROb2RlUG9vbE9iai5zaXplfX0KICAgICAgICAgICAgLz4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMSI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImFjYy1sYWJlbCBwYi0xMCI+CiAgICAgICAgICAgICAgQWN0aW9ucwogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGJ1dHRvbgogICAgICAgICAgICAgIGNsYXNzPSJidG4gYmctcHJpbWFyeSBpY29uLWJ0biBwLTAiCiAgICAgICAgICAgICAge3thY3Rpb24gImFkZFNlbGVjdGVkTm9kZVBvb2wifX0KICAgICAgICAgICAgPgogICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSJkYXJrZW4iPgogICAgICAgICAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi1wbHVzIHRleHQtc21hbGwiPjwvaT4KICAgICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgICAgPHNwYW4+CiAgICAgICAgICAgICAgICBBZGQgTm9kZSBQb29sCiAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICA8L2J1dHRvbj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImVtYmVyLXZpZXciPgogICAgICAgICAgPGRpdiBjbGFzcz0iaGVhZGVyIG10LTIwIGNsZWFyZml4Ij4KICAgICAgICAgICAgPGRpdiBjbGFzcz0icHVsbC1sZWZ0Ij4KICAgICAgICAgICAgICA8aDIgY2xhc3M9Im1iLTAiPgogICAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29scy5sYWJlbCJ9fQogICAgICAgICAgICAgIDwvaDI+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJncmlkIHNvcnRhYmxlLXRhYmxlIGVtYmVyLXZpZXciPgogICAgICAgICAgICA8dGFibGUgY2xhc3M9ImZpeGVkIGdyaWQgc29ydGFibGUtdGFibGUiPgogICAgICAgICAgICAgIDx0aGVhZD4KICAgICAgICAgICAgICAgIDx0ciBjbGFzcz0iZml4ZWQtaGVhZGVyIj4KICAgICAgICAgICAgICAgICAgPHRoIGxhc3M9InNvcnRhYmxlIGVtYmVyLXZpZXciIHJvbGU9ImNvbHVtbmhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9ImJ0biBiZy10cmFuc3BhcmVudCI+CiAgICAgICAgICAgICAgICAgICAgICBMYWJlbAogICAgICAgICAgICAgICAgICAgIDwvYT4KICAgICAgICAgICAgICAgICAgPC90aD4KICAgICAgICAgICAgICAgICAgPHRoIGxhc3M9InNvcnRhYmxlIGVtYmVyLXZpZXciIHJvbGU9ImNvbHVtbmhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9ImJ0biBiZy10cmFuc3BhcmVudCI+CiAgICAgICAgICAgICAgICAgICAgICBEaXNrIFNpemUKICAgICAgICAgICAgICAgICAgICA8L2E+CiAgICAgICAgICAgICAgICAgIDwvdGg+CiAgICAgICAgICAgICAgICAgIDx0aCBsYXNzPSJzb3J0YWJsZSBlbWJlci12aWV3IiByb2xlPSJjb2x1bW5oZWFkZXIiPgogICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPgogICAgICAgICAgICAgICAgICAgICAgU2l6ZQogICAgICAgICAgICAgICAgICAgIDwvYT4KICAgICAgICAgICAgICAgICAgPC90aD4KICAgICAgICAgICAgICAgICAgPHRoIGxhc3M9InNvcnRhYmxlIGVtYmVyLXZpZXciIHJvbGU9ImNvbHVtbmhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9ImJ0biBiZy10cmFuc3BhcmVudCI+PC9hPgogICAgICAgICAgICAgICAgICA8L3RoPgogICAgICAgICAgICAgICAgPC90cj4KICAgICAgICAgICAgICA8L3RoZWFkPgogICAgICAgICAgICAgIDx0Ym9keT4KICAgICAgICAgICAgICAgIHt7I2VhY2ggdGhpcy5zZWxlY3RlZE5vZGVQb29sTGlzdCBhcyB8c2VsZWN0ZWROb2RlUG9vbHx9fQogICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9Im1haW4tcm93IGVtYmVyLXZpZXciPgogICAgICAgICAgICAgICAgICAgIDx0ZD4KICAgICAgICAgICAgICAgICAgICAgIHt7c2VsZWN0ZWROb2RlUG9vbC5sYWJlbH19CiAgICAgICAgICAgICAgICAgICAgPC90ZD4KICAgICAgICAgICAgICAgICAgICA8dGQ+CiAgICAgICAgICAgICAgICAgICAgICAgPElucHV0CiAgICAgICAgICAgICAgICAgICAgICAgIEB0eXBlPSJudW1iZXIiCiAgICAgICAgICAgICAgICAgICAgICAgIEBtaW49IjUwIgogICAgICAgICAgICAgICAgICAgICAgICBAdmFsdWU9e3tzZWxlY3RlZE5vZGVQb29sLmRpc2tTaXplfX0KICAgICAgICAgICAgICAgICAgICAgIC8+CiAgICAgICAgICAgICAgICAgICAgPC90ZD4KICAgICAgICAgICAgICAgICAgICA8dGQ+CiAgICAgICAgICAgICAgICAgICAgICA8SW5wdXQKICAgICAgICAgICAgICAgICAgICAgICAgQHR5cGU9Im51bWJlciIKICAgICAgICAgICAgICAgICAgICAgICAgQG1pbj0iMSIKICAgICAgICAgICAgICAgICAgICAgICAgQHZhbHVlPXt7c2VsZWN0ZWROb2RlUG9vbC5zaXplfX0KICAgICAgICAgICAgICAgICAgICAgIC8+CiAgICAgICAgICAgICAgICAgICAgPC90ZD4KICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9InRleHQtY2VudGVyIj4KICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9ImJ0biBiZy1lcnJvciBidG4tc20iCiAgICAgICAgICAgICAgICAgICAgICAgIHt7YWN0aW9uICJkZWxldGVOb2RlUG9vbCIgc2VsZWN0ZWROb2RlUG9vbC5pZH19CiAgICAgICAgICAgICAgICAgICAgICA+CiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSJpY29uIGljb24tdHJhc2giPjwvaT4KICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgICAgICAgIDwvdHI+CiAgICAgICAgICAgICAgICB7e2Vsc2V9fQogICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9Im1haW4tcm93IGVtYmVyLXZpZXciPgogICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPSI4IiBjbGFzcz0icC0xMCB0ZXh0LWNlbnRlciI+CiAgICAgICAgICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xzLmVtcHR5In19CiAgICAgICAgICAgICAgICAgICAgPC90ZD4KICAgICAgICAgICAgICAgICAgPC90cj4KICAgICAgICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgICAgICAgIDwvdGJvZHk+CiAgICAgICAgICAgIDwvdGFibGU+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICB7eyEgc2hvdyBzZWxlY3RlZCBub2RlIHBvb2xzIGVuZCB9fQogICAgICB7ey9hY2NvcmRpb24tbGlzdC1pdGVtfX0KICAgICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgICB7eyNpZiAoZXEgbW9kZSAiZWRpdCIpfX0KICAgICAgICB7e3NhdmUtY2FuY2VsCiAgICAgICAgICBidG5MYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbENvbmZpZy51cGRhdGUiCiAgICAgICAgICBzYXZpbmdMYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbENvbmZpZy5sb2FkaW5nIgogICAgICAgICAgc2F2ZT0idXBkYXRlQ2x1c3RlciIKICAgICAgICAgIGNhbmNlbD1jbG9zZQogICAgICAgIH19CiAgICAgIHt7ZWxzZX19CiAgICAgICAge3tzYXZlLWNhbmNlbAogICAgICAgICAgYnRuTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xDb25maWcubmV4dCIKICAgICAgICAgIHNhdmluZ0xhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29sQ29uZmlnLmxvYWRpbmciCiAgICAgICAgICBzYXZlPSJjcmVhdGVDbHVzdGVyIgogICAgICAgICAgY2FuY2VsPWNsb3NlCiAgICAgICAgfX0KICAgICAge3svaWZ9fQogICAge3svaWZ9fQogIHt7L2FjY29yZGlvbi1saXN0fX0KPC9zZWN0aW9uPg==';
  const languages = {
    'en-us': {
      'clusterNew': {
        'exoscalesks': {
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
  const computed = Ember.computed;
  const observer = Ember.observer;
  const get = Ember.get;
  const set = Ember.set;
  const alias = Ember.computed.alias;
  const service = Ember.inject.service;
  const next = Ember.run.next;
  exports.default = Ember.Component.extend(_clusterDriver.default, {
    driverName: '@exoscale/ui-cluster-driver-sks',
    configField: '@exoscale/ui-cluster-driver-sksEngineConfig',
    app: service(),
    router: service(),
    session: service(),
    intl: service(),
    exoscale: service(),
    step: 1,
    lanChanged: null,
    refresh: false,
    exoscaleApi: 'api-ch-gva-2.exoscale.com/v2',
    init() {
      const decodedLayout = window.atob(LAYOUT);
      const template = Ember.HTMLBars.compile(decodedLayout, {
        moduleName: 'shared/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/template'
      });
      set(this, 'layout', template);
      this._super(...arguments);
      const lang = get(this, 'session.language');
      get(this, 'intl.locale');
      this.loadLanguage(lang);
      let config = get(this, 'config');
      let configField = get(this, 'configField');
      set(this, "selectedNodePoolType", "");
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
        set(this, 'cluster.@exoscale/ui-cluster-driver-sksEngineConfig', config);
      }
    },
    config: alias('cluster.@exoscale/ui-cluster-driver-sksEngineConfig'),
    actions: {
      verifyAccessKeys(cb) {
        const apikey = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.apikey");
        const secret = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.apisecret");
        const intl = get(this, "intl");
        if (!apikey || !secret) {
          this.set("errors", [intl.t("clusterNew.exoscalesks.apikey.required"), intl.t("clusterNew.exoscalesks.apisecret.required")]);
          cb(false);
          return;
        }
        const levels = [{
          id: "starter"
        }, {
          id: "pro"
        }];
        const handleError = err => {
          this.set("errors", [`Error received from Exoscale: ${err.message}`]);
          cb(false);
        };
        Promise.all([this.apiRequest("zone", "GET", {}, "", apikey, secret).then(response => response.zones.map(zone => ({
          id: zone.name
        }))), this.apiRequest("sks-cluster-version", "GET", {}, "", apikey, secret).then(response => response["sks-cluster-versions"].map(version => ({
          id: version
        }))), this.apiRequest("instance-type", "GET", {}, "", apikey, secret).then(response => response["instance-types"].filter(instanceType => instanceType.size !== "tiny" && instanceType.size !== "micro").map(instanceType => ({
          id: instanceType.id,
          label: `${instanceType.family}.${instanceType.size}`,
          diskSize: 50
        })))]).then(([zones, k8sVersions, nodeTypes]) => {
          this.setProperties({
            errors: [],
            step: 2,
            zones,
            levels,
            nodeTypes,
            k8sVersions
          });
          cb(true);
        }).catch(handleError);
      },
      verifyClusterConfig(cb) {
        const errors = [];
        const intl = get(this, 'intl');
        const zone = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.zone");
        if (!zone) {
          const zones = get(this, "zones");
          if (zones && zones.length > 0) {
            const defaultZone = zones[0].id;
            set(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.zone", defaultZone);
          } else {
            errors.push(intl.t("clusterNew.exoscalesks.zone.required"));
            set(this, "errors", errors);
          }
        }
        const kubernetesVersion = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.kubernetesVersion");
        if (!kubernetesVersion) {
          const k8sVersions = get(this, "k8sVersions");
          if (k8sVersions && k8sVersions.length > 0) {
            const defaultK8sVersion = k8sVersions[0].id;
            set(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.kubernetesVersion", defaultK8sVersion);
          } else {
            errors.push(intl.t("clusterNew.exoscalesks.kubernetesVersion.required"));
            set(this, "errors", errors);
          }
        }
        const level = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.level");
        if (!level) {
          const levels = get(this, "levels");
          if (levels && levels.length > 0) {
            const defaultLevel = levels[0].id;
            set(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.level", defaultLevel);
          } else {
            errors.push(intl.t("clusterNew.exoscalesks.level.required"));
            set(this, "errors", errors);
          }
        }
        if (errors.length > 0) {
          cb(false);
          return;
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
        get(this, 'router').transitionTo('global-admin.clusters.index');
        cb(true);
      },
      addSelectedNodePool() {
        const selectedNodePoolObj = get(this, "selectedNodePoolObj");
        const selectedNodePoolList = get(this, "selectedNodePoolList");
        if (selectedNodePoolObj.id) {
          selectedNodePoolList.pushObject(selectedNodePoolObj);
          set(this, "selectedNodePoolType", "");
          set(this, "selectedNodePoolObj", {});
        }
      },
      deleteNodePool(id) {
        const selectedNodePoolList = get(this, "selectedNodePoolList");
        set(this, "selectedNodePoolList", selectedNodePoolList.filter(n => n.id !== id));
      }
    },
    validate() {
      this._super();
      var errors = get(this, 'errors') || [];
      if (!get(this, 'cluster.name')) {
        errors.push('Name is required');
      }
      if (get(errors, 'length')) {
        set(this, 'errors', errors);
        return false;
      } else {
        set(this, 'errors', null);
        return true;
      }
    },
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
      set(this, 'cluster.@exoscale/ui-cluster-driver-sksEngineConfig.name', clusterName);
      set(this, 'cluster.@exoscale/ui-cluster-driver-sksEngineConfig.providerName', clusterName);
    }),
    clusterDescriptionChanged: observer('cluster.description', function () {
      const clusterDescription = get(this, 'cluster.description');
      set(this, 'cluster.@exoscale/ui-cluster-driver-sksEngineConfig.description', clusterDescription);
    }),
    accessConfigTitle: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.accessConfig.title");
    }),
    accessConfigDetail: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.accessConfig.description");
    }),
    clusterConfigTitle: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.clusterConfig.title");
    }),
    clusterConfigDetail: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.clusterConfig.description");
    }),
    zoneChoises: computed('zones', async function () {
      const ans = await get(this, "zones");
      return ans.map(e => {
        return {
          label: e.id,
          value: e.id
        };
      });
    }),
    levelChoises: computed('levels', async function () {
      const ans = await get(this, "levels");
      return ans.map(e => {
        return {
          label: e.id,
          value: e.id
        };
      });
    }),
    k8sVersionChoises: computed('k8sVersions', async function () {
      const ans = await get(this, "k8sVersions");
      return ans.map(e => {
        return {
          label: e.id,
          value: e.id
        };
      });
    }),
    nodePoolConfigTitle: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.nodePoolConfig.title");
    }),
    nodePoolConfigDetail: computed('intl.locale', 'langChanged', function () {
      return get(this, 'intl').t("clusterNew.exoscalesks.nodePoolConfig.description");
    }),
    nodePoolChoises: computed("nodeTypes.[]", "selectedNodePoolList.[]", async function () {
      const intl = get(this, 'intl');
      const ans = await get(this, "nodeTypes");
      const filteredAns = ans.filter(np => {
        const selectedNodePoolList = get(this, "selectedNodePoolList");
        const fnd = selectedNodePoolList.find(snp => snp.id === np.id);
        if (fnd) return false;else return true;
      }).map(np => {
        return {
          label: np.label,
          value: np.id
        };
      });
      return [{
        label: intl.t("clusterNew.exoscalesks.nodePools.placeholder"),
        value: ""
      }, ...filteredAns];
    }),
    setSelectedNodePoolObj: observer("selectedNodePoolType", async function () {
      const nodePoolTypes = await get(this, "nodeTypes");
      const selectedNodePoolType = get(this, "selectedNodePoolType");
      if (selectedNodePoolType) {
        const ans = nodePoolTypes.find(np => np.id === selectedNodePoolType);
        set(this, "selectedNodePoolObj", {
          ...ans,
          size: 1,
          diskSize: 50
        });
      } else set(this, "selectedNodePoolObj", {});
    }),
    setNodePools: observer("selectedNodePoolList.@each.{size,diskSize}", function () {
      const selectedNodePoolList = get(this, "selectedNodePoolList");
      const nodePools = selectedNodePoolList.map(np => {
        return `${np.id}=${np.size},${np.diskSize}`;
      });
      set(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.nodePools", nodePools);
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
    prefillSelectedNodePoolListObserver: observer("nodeTypes.[]", function () {
      this.prefillSelectedNodePoolList();
    }),
    async prefillSelectedNodePoolList() {
      const nodePools = get(this, "cluster.@exoscale/ui-cluster-driver-sksEngineConfig.nodePools");
      const nodePoolTypes = await get(this, "nodeTypes");
      if (nodePools && nodePools.length) {
        set(this, "selectedNodePoolList", nodePools.map(np => {
          const [npId, config] = np.split("=");
          const [size, diskSize] = config.split(",");
          const fnd = Array.isArray(nodePoolTypes) ? nodePoolTypes.find(npt => npt.id === npId) : null;
          if (fnd) {
            return {
              ...fnd,
              size: parseInt(size, 10),
              diskSize: parseInt(diskSize, 10)
            };
          } else {
            return {
              id: npId,
              size: parseInt(size, 10),
              diskSize: parseInt(diskSize, 10),
              label: npId
            };
          }
        }));
      } else {
        set(this, "selectedNodePoolList", []);
      }
    },
    apiRequest(endpoint, method = 'GET', params = {}, body = '', apikey, secret) {
      const baseUrl = `${get(this, 'app.proxyEndpoint')}/${this.exoscaleApi}`;
      const url = `${baseUrl}/${endpoint}`;
      const expires = Math.floor(Date.now() / 1000) + 600;
      const sortedParams = Object.keys(params).sort();
      const queryString = new URLSearchParams(params).toString();
      const queryValues = sortedParams.map(key => params[key]).join('');
      const requestBody = body ? JSON.stringify(body) : '';
      const message = [`${method} /v2/${endpoint}`, requestBody, queryValues, '', expires.toString()].join('\n');
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
          'X-API-Auth-Header': authorizationHeader
        },
        data: method === 'POST' ? requestBody : undefined
      };
      return (0, _ajaxPromise.ajaxPromise)(options, true).then(response => response).catch(err => {
        const errorCode = err?.xhr?.status || 'Unknown';
        const errorResponse = err?.xhr?.responseText || 'No response body';
        throw new Error(`Exoscale API Error (Code: ${errorCode}): ${errorResponse}`);
      });
    }
  });
});
"use strict";

define("ui/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/component", ["exports", "shared/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/component"], function (exports, _component) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});
define.alias('shared/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/component', 'global-admin/components/cluster-driver/driver-@exoscale/ui-cluster-driver-sks/component');
