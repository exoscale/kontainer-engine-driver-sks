"use strict";

define("shared/components/cluster-driver/driver-exoscale/component", ["exports", "shared/mixins/cluster-driver", "@rancher/ember-api-store/utils/ajax-promise"], function (exports, _clusterDriver, _ajaxPromise) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const LAYOUT = 'PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjYWNjb3JkaW9uLWxpc3Qgc2hvd0V4cGFuZEFsbD1mYWxzZSBhcyB8YWwgZXhwYW5kRm58fX0KICAgIHt7I2lmIChlcSBzdGVwIDEpfX0KICAgICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICAgIHRpdGxlPWFjY2Vzc0NvbmZpZ1RpdGxlCiAgICAgICAgZGV0YWlsPWFjY2Vzc0NvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xMiI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYXBpa2V5LmxhYmVsIn19CiAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlrZXkKICAgICAgICAgICAgfX0KICAgICAgICAgICAgICB7e2lucHV0CiAgICAgICAgICAgICAgICBuYW1lPSJhcGlrZXkiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlrZXkucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlrZXkKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMTIiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmFwaXNlY3JldC5sYWJlbCJ9fQogICAgICAgICAgICAgIHt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5CiAgICAgICAgICAgICAgZWRpdGFibGU9dHJ1ZQogICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuZXhvc2NhbGVFbmdpbmVDb25maWcuYXBpc2VjcmV0CiAgICAgICAgICAgIH19CiAgICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgICAgdHlwZT0icGFzc3dvcmQiCiAgICAgICAgICAgICAgICBuYW1lPSJhcGlzZWNyZXQiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlzZWNyZXQucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlzZWNyZXQKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICB7ey9hY2NvcmRpb24tbGlzdC1pdGVtfX0KICAgICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgICB7e3NhdmUtY2FuY2VsCiAgICAgICAgYnRuTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYWNjZXNzQ29uZmlnLm5leHQiCiAgICAgICAgc2F2aW5nTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYWNjZXNzQ29uZmlnLmxvYWRpbmciCiAgICAgICAgc2F2ZT0idmVyaWZ5QWNjZXNzS2V5cyIKICAgICAgICBjYW5jZWw9Y2xvc2UKICAgICAgfX0KICAgIHt7ZWxzZSBpZiAoZXEgc3RlcCAyKX19CiAgICAgIHt7I2FjY29yZGlvbi1saXN0LWl0ZW0KICAgICAgICB0aXRsZT1jbHVzdGVyQ29uZmlnVGl0bGUKICAgICAgICBkZXRhaWw9Y2x1c3RlckNvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIHt7I2lmIChlcSBtb2RlICJuZXciKX19CiAgICAgICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Muem9uZS5sYWJlbCJ9fQogICAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5CiAgICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLmV4b3NjYWxlRW5naW5lQ29uZmlnLnpvbmUKICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgICAge3tuZXctc2VsZWN0CiAgICAgICAgICAgICAgICAgIGNsYXNzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ9em9uZUNob2lzZXMKICAgICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy56b25lCiAgICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmt1YmVybmV0ZXNWZXJzaW9uLmxhYmVsIn19CiAgICAgICAgICAgICAgICB7e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICAgIGVkaXRhYmxlPXRydWUKICAgICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuZXhvc2NhbGVFbmdpbmVDb25maWcua3ViZXJuZXRlc1ZlcnNpb24KICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgICAge3tuZXctc2VsZWN0CiAgICAgICAgICAgICAgICAgIGNsYXNzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ9azhzVmVyc2lvbkNob2lzZXMKICAgICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5rdWJlcm5ldGVzVmVyc2lvbgogICAgICAgICAgICAgICAgfX0KICAgICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICB7ey9pZn19CiAgICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmxldmVsLmxhYmVsIn19CiAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5sZXZlbAogICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7bmV3LXNlbGVjdAogICAgICAgICAgICAgICAgY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIGNvbnRlbnQ9bGV2ZWxDaG9pc2VzCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLmV4b3NjYWxlRW5naW5lQ29uZmlnLmxldmVsCiAgICAgICAgICAgICAgfX0KICAgICAgICAgICAge3svaW5wdXQtb3ItZGlzcGxheX19CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICB7eyEtLSBBREQgVEFJTlRTIEhFUkUgLS19fQoKICAgICAgICAgIHt7IS0tIDxkaXYgY2xhc3M9ImhlYWRlciBtdC0yMCBjbGVhcmZpeCI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9InB1bGwtbGVmdCI+CiAgICAgICAgICAgICAgPGgyIGNsYXNzPSJtYi0wIj4KICAgICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5sYWJlbHMubGFiZWwifX0KICAgICAgICAgICAgICA8L2gyPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNSI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MubGFiZWxzLm5ld0xhYmVsIn19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkgZWRpdGFibGU9dHJ1ZSB2YWx1ZT1uZXdMYWJlbH19CiAgICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgICAgdHlwZT0idGV4dCIKICAgICAgICAgICAgICAgIG5hbWU9ImxhYmVscyIKICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSh0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmxhYmVscy5wbGFjZWhvbGRlciIpCiAgICAgICAgICAgICAgICB2YWx1ZT1uZXdMYWJlbAogICAgICAgICAgICAgIH19CiAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xIj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0iYnRuIGJnLXByaW1hcnkgYnRuLXNtIG10LTMwIiB7e2FjdGlvbiAiYWRkTmV3TGFiZWwifX0+CiAgICAgICAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi1wbHVzIj48L2k+CiAgICAgICAgICAgIDwvYnV0dG9uPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgPGRpdiBjbGFzcz0ic2tzLWxhYmVscyI+CiAgICAgICAgICAgICAge3sjZWFjaCBjbHVzdGVyLmV4b3NjYWxlRW5naW5lQ29uZmlnLmxhYmVscyBhcyB8bGFiZWwgbGFiZWxJZHh8fX0KICAgICAgICAgICAgICAgIDwhLS0gICAgIHNpbmdsZSBsYWJlbCBzdGFydCAtLT4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9InNrcy1sYWJlbCBiZy1wcmltYXJ5Ij4KICAgICAgICAgICAgICAgICAgPHNwYW4+CiAgICAgICAgICAgICAgICAgICAge3tsYWJlbH19CiAgICAgICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbgogICAgICAgICAgICAgICAgICAgIGNsYXNzPSJza3MtZGVsZXRlIGJnLWVycm9yIgogICAgICAgICAgICAgICAgICAgIHt7YWN0aW9uICJkZWxldGVMYWJlbCIgbGFiZWxJZHh9fQogICAgICAgICAgICAgICAgICA+CiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi10cmFzaCI+PC9pPgogICAgICAgICAgICAgICAgICA8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPCEtLSAgICAgc2luZ2xlIGxhYmVsIGVuZCAgLS0+CiAgICAgICAgICAgICAge3tlbHNlfX0KICAgICAgICAgICAgICAgIE5vIGxhYmVscyBhZGRlZAogICAgICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PiAtLX19CiAgICAgICAgPC9kaXY+CiAgICAgIHt7L2FjY29yZGlvbi1saXN0LWl0ZW19fQogICAgICB7e3RvcC1lcnJvcnMgZXJyb3JzPWVycm9yc319CiAgICAgIHt7c2F2ZS1jYW5jZWwKICAgICAgICBidG5MYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5jbHVzdGVyQ29uZmlnLm5leHQiCiAgICAgICAgc2F2aW5nTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuY2x1c3RlckNvbmZpZy5sb2FkaW5nIgogICAgICAgIHNhdmU9InZlcmlmeUNsdXN0ZXJDb25maWciCiAgICAgICAgY2FuY2VsPWNsb3NlCiAgICAgIH19CiAgICB7e2Vsc2UgaWYgKGVxIHN0ZXAgMyl9fQogICAgICB7eyNhY2NvcmRpb24tbGlzdC1pdGVtCiAgICAgICAgdGl0bGU9bm9kZVBvb2xDb25maWdUaXRsZQogICAgICAgIGRldGFpbD1ub2RlUG9vbENvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIHt7ISBzZWxlY3Qgbm9kZSBwb29sIH19CiAgICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTQiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLnNlbGVjdGVkTm9kZVBvb2xUeXBlLmxhYmVsIn19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkgZWRpdGFibGU9dHJ1ZSB2YWx1ZT1zZWxlY3RlZE5vZGVQb29sVHlwZX19CiAgICAgICAgICAgICAge3tuZXctc2VsZWN0CiAgICAgICAgICAgICAgICBjbGFzcz0iZm9ybS1jb250cm9sIgogICAgICAgICAgICAgICAgY29udGVudD1ub2RlUG9vbENob2lzZXMKICAgICAgICAgICAgICAgIHZhbHVlPXNlbGVjdGVkTm9kZVBvb2xUeXBlCiAgICAgICAgICAgICAgfX0KICAgICAgICAgICAge3svaW5wdXQtb3ItZGlzcGxheX19CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTEiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIERpc2sgU2l6ZToKICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDxJbnB1dAogICAgICAgICAgICAgIEB0eXBlPSJudW1iZXIiCiAgICAgICAgICAgICAgQG1pbj0iNTAiCiAgICAgICAgICAgICAgQHZhbHVlPXt7dGhpcy5zZWxlY3RlZE5vZGVQb29sT2JqLmRpc2tTaXplfX0KICAgICAgICAgICAgLz4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMSI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAgU2l6ZToKICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDxJbnB1dAogICAgICAgICAgICAgIEB0eXBlPSJudW1iZXIiCiAgICAgICAgICAgICAgQG1pbj0iMSIKICAgICAgICAgICAgICBAdmFsdWU9e3t0aGlzLnNlbGVjdGVkTm9kZVBvb2xPYmouc2l6ZX19CiAgICAgICAgICAgIC8+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTEiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJhY2MtbGFiZWwgcGItMTAiPgogICAgICAgICAgICAgIEFjdGlvbnMKICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAgICBjbGFzcz0iYnRuIGJnLXByaW1hcnkgaWNvbi1idG4gcC0wIgogICAgICAgICAgICAgIHt7YWN0aW9uICJhZGRTZWxlY3RlZE5vZGVQb29sIn19CiAgICAgICAgICAgID4KICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0iZGFya2VuIj4KICAgICAgICAgICAgICAgIDxpIGNsYXNzPSJpY29uIGljb24tcGx1cyB0ZXh0LXNtYWxsIj48L2k+CiAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICAgIDxzcGFuPgogICAgICAgICAgICAgICAgQWRkIE5vZGUgUG9vbAogICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgPC9idXR0b24+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJlbWJlci12aWV3Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImhlYWRlciBtdC0yMCBjbGVhcmZpeCI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9InB1bGwtbGVmdCI+CiAgICAgICAgICAgICAgPGgyIGNsYXNzPSJtYi0wIj4KICAgICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbHMubGFiZWwifX0KICAgICAgICAgICAgICA8L2gyPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iZ3JpZCBzb3J0YWJsZS10YWJsZSBlbWJlci12aWV3Ij4KICAgICAgICAgICAgPHRhYmxlIGNsYXNzPSJmaXhlZCBncmlkIHNvcnRhYmxlLXRhYmxlIj4KICAgICAgICAgICAgICA8dGhlYWQ+CiAgICAgICAgICAgICAgICA8dHIgY2xhc3M9ImZpeGVkLWhlYWRlciI+CiAgICAgICAgICAgICAgICAgIDx0aCBsYXNzPSJzb3J0YWJsZSBlbWJlci12aWV3IiByb2xlPSJjb2x1bW5oZWFkZXIiPgogICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPgogICAgICAgICAgICAgICAgICAgICAgTGFiZWwKICAgICAgICAgICAgICAgICAgICA8L2E+CiAgICAgICAgICAgICAgICAgIDwvdGg+CiAgICAgICAgICAgICAgICAgIDx0aCBsYXNzPSJzb3J0YWJsZSBlbWJlci12aWV3IiByb2xlPSJjb2x1bW5oZWFkZXIiPgogICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPgogICAgICAgICAgICAgICAgICAgICAgRGlzayBTaXplCiAgICAgICAgICAgICAgICAgICAgPC9hPgogICAgICAgICAgICAgICAgICA8L3RoPgogICAgICAgICAgICAgICAgICA8dGggbGFzcz0ic29ydGFibGUgZW1iZXItdmlldyIgcm9sZT0iY29sdW1uaGVhZGVyIj4KICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz0iYnRuIGJnLXRyYW5zcGFyZW50Ij4KICAgICAgICAgICAgICAgICAgICAgIFNpemUKICAgICAgICAgICAgICAgICAgICA8L2E+CiAgICAgICAgICAgICAgICAgIDwvdGg+CiAgICAgICAgICAgICAgICAgIDx0aCBsYXNzPSJzb3J0YWJsZSBlbWJlci12aWV3IiByb2xlPSJjb2x1bW5oZWFkZXIiPgogICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPjwvYT4KICAgICAgICAgICAgICAgICAgPC90aD4KICAgICAgICAgICAgICAgIDwvdHI+CiAgICAgICAgICAgICAgPC90aGVhZD4KICAgICAgICAgICAgICA8dGJvZHk+CiAgICAgICAgICAgICAgICB7eyNlYWNoIHRoaXMuc2VsZWN0ZWROb2RlUG9vbExpc3QgYXMgfHNlbGVjdGVkTm9kZVBvb2x8fX0KICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPSJtYWluLXJvdyBlbWJlci12aWV3Ij4KICAgICAgICAgICAgICAgICAgICA8dGQ+CiAgICAgICAgICAgICAgICAgICAgICB7e3NlbGVjdGVkTm9kZVBvb2wubGFiZWx9fQogICAgICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgICAgICAgICAgPHRkPgogICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dAogICAgICAgICAgICAgICAgICAgICAgICBAdHlwZT0ibnVtYmVyIgogICAgICAgICAgICAgICAgICAgICAgICBAbWluPSI1MCIKICAgICAgICAgICAgICAgICAgICAgICAgQHZhbHVlPXt7c2VsZWN0ZWROb2RlUG9vbC5kaXNrU2l6ZX19CiAgICAgICAgICAgICAgICAgICAgICAvPgogICAgICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgICAgICAgICAgPHRkPgogICAgICAgICAgICAgICAgICAgICAgPElucHV0CiAgICAgICAgICAgICAgICAgICAgICAgIEB0eXBlPSJudW1iZXIiCiAgICAgICAgICAgICAgICAgICAgICAgIEBtaW49IjEiCiAgICAgICAgICAgICAgICAgICAgICAgIEB2YWx1ZT17e3NlbGVjdGVkTm9kZVBvb2wuc2l6ZX19CiAgICAgICAgICAgICAgICAgICAgICAvPgogICAgICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPSJ0ZXh0LWNlbnRlciI+CiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uCiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPSJidG4gYmctZXJyb3IgYnRuLXNtIgogICAgICAgICAgICAgICAgICAgICAgICB7e2FjdGlvbiAiZGVsZXRlTm9kZVBvb2wiIHNlbGVjdGVkTm9kZVBvb2wuaWR9fQogICAgICAgICAgICAgICAgICAgICAgPgogICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0iaWNvbiBpY29uLXRyYXNoIj48L2k+CiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICAgICAgICA8L3RyPgogICAgICAgICAgICAgICAge3tlbHNlfX0KICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPSJtYWluLXJvdyBlbWJlci12aWV3Ij4KICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj0iOCIgY2xhc3M9InAtMTAgdGV4dC1jZW50ZXIiPgogICAgICAgICAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29scy5lbXB0eSJ9fQogICAgICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgICAgICAgIDwvdHI+CiAgICAgICAgICAgICAgICB7ey9lYWNofX0KICAgICAgICAgICAgICA8L3Rib2R5PgogICAgICAgICAgICA8L3RhYmxlPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAge3shIHNob3cgc2VsZWN0ZWQgbm9kZSBwb29scyBlbmQgfX0KICAgICAge3svYWNjb3JkaW9uLWxpc3QtaXRlbX19CiAgICAgIHt7dG9wLWVycm9ycyBlcnJvcnM9ZXJyb3JzfX0KICAgICAge3sjaWYgKGVxIG1vZGUgImVkaXQiKX19CiAgICAgICAge3tzYXZlLWNhbmNlbAogICAgICAgICAgYnRuTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xDb25maWcudXBkYXRlIgogICAgICAgICAgc2F2aW5nTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xDb25maWcubG9hZGluZyIKICAgICAgICAgIHNhdmU9InVwZGF0ZUNsdXN0ZXIiCiAgICAgICAgICBjYW5jZWw9Y2xvc2UKICAgICAgICB9fQogICAgICB7e2Vsc2V9fQogICAgICAgIHt7c2F2ZS1jYW5jZWwKICAgICAgICAgIGJ0bkxhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29sQ29uZmlnLm5leHQiCiAgICAgICAgICBzYXZpbmdMYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbENvbmZpZy5sb2FkaW5nIgogICAgICAgICAgc2F2ZT0iY3JlYXRlQ2x1c3RlciIKICAgICAgICAgIGNhbmNlbD1jbG9zZQogICAgICAgIH19CiAgICAgIHt7L2lmfX0KICAgIHt7L2lmfX0KICB7ey9hY2NvcmRpb24tbGlzdH19Cjwvc2VjdGlvbj4=';
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
    driverName: 'exoscale',
    configField: 'exoscaleEngineConfig',
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
        moduleName: 'shared/components/cluster-driver/driver-exoscale/template'
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
        set(this, 'cluster.exoscaleEngineConfig', config);
      }
    },
    config: alias('cluster.exoscaleEngineConfig'),
    actions: {
      verifyAccessKeys(cb) {
        const apikey = get(this, "cluster.exoscaleEngineConfig.apikey");
        const secret = get(this, "cluster.exoscaleEngineConfig.apisecret");
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
        const zone = get(this, "cluster.exoscaleEngineConfig.zone");
        if (!zone) {
          const zones = get(this, "zones");
          if (zones && zones.length > 0) {
            const defaultZone = zones[0].id;
            set(this, "cluster.exoscaleEngineConfig.zone", defaultZone);
          } else {
            errors.push(intl.t("clusterNew.exoscalesks.zone.required"));
            set(this, "errors", errors);
          }
        }
        const kubernetesVersion = get(this, "cluster.exoscaleEngineConfig.kubernetesVersion");
        if (!kubernetesVersion) {
          const k8sVersions = get(this, "k8sVersions");
          if (k8sVersions && k8sVersions.length > 0) {
            const defaultK8sVersion = k8sVersions[0].id;
            set(this, "cluster.exoscaleEngineConfig.kubernetesVersion", defaultK8sVersion);
          } else {
            errors.push(intl.t("clusterNew.exoscalesks.kubernetesVersion.required"));
            set(this, "errors", errors);
          }
        }
        const level = get(this, "cluster.exoscaleEngineConfig.level");
        if (!level) {
          const levels = get(this, "levels");
          if (levels && levels.length > 0) {
            const defaultLevel = levels[0].id;
            set(this, "cluster.exoscaleEngineConfig.level", defaultLevel);
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
      set(this, 'cluster.exoscaleEngineConfig.name', clusterName);
      set(this, 'cluster.exoscaleEngineConfig.providerName', clusterName);
    }),
    clusterDescriptionChanged: observer('cluster.description', function () {
      const clusterDescription = get(this, 'cluster.description');
      set(this, 'cluster.exoscaleEngineConfig.description', clusterDescription);
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
      set(this, "cluster.exoscaleEngineConfig.nodePools", nodePools);
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
      const nodePools = get(this, "cluster.exoscaleEngineConfig.nodePools");
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

define("ui/components/cluster-driver/driver-exoscale/component", ["exports", "shared/components/cluster-driver/driver-exoscale/component"], function (exports, _component) {
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
define.alias('shared/components/cluster-driver/driver-exoscale/component', 'global-admin/components/cluster-driver/driver-exoscale/component');
