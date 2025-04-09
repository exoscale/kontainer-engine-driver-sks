"use strict";

define("shared/components/cluster-driver/driver-exoscale/component", ["exports", "shared/mixins/cluster-driver", "@rancher/ember-api-store/utils/ajax-promise"], function (exports, _clusterDriver, _ajaxPromise) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const LAYOUT = 'PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjYWNjb3JkaW9uLWxpc3Qgc2hvd0V4cGFuZEFsbD1mYWxzZSBhcyB8YWwgZXhwYW5kRm58fX0KICAgIHt7I2lmIChlcSBzdGVwIDEpfX0KICAgICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICAgIHRpdGxlPWFjY2Vzc0NvbmZpZ1RpdGxlCiAgICAgICAgZGV0YWlsPWFjY2Vzc0NvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xMiI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYXBpa2V5LmxhYmVsIn19CiAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlrZXkKICAgICAgICAgICAgfX0KICAgICAgICAgICAgICB7e2lucHV0CiAgICAgICAgICAgICAgICBuYW1lPSJhcGlrZXkiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlrZXkucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlrZXkKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMTIiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmFwaXNlY3JldC5sYWJlbCJ9fQogICAgICAgICAgICAgIHt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5CiAgICAgICAgICAgICAgZWRpdGFibGU9dHJ1ZQogICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuZXhvc2NhbGVFbmdpbmVDb25maWcuYXBpc2VjcmV0CiAgICAgICAgICAgIH19CiAgICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgICAgdHlwZT0icGFzc3dvcmQiCiAgICAgICAgICAgICAgICBuYW1lPSJhcGlzZWNyZXQiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5hcGlzZWNyZXQucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5hcGlzZWNyZXQKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICB7ey9hY2NvcmRpb24tbGlzdC1pdGVtfX0KICAgICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgICB7e3NhdmUtY2FuY2VsCiAgICAgICAgYnRuTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYWNjZXNzQ29uZmlnLm5leHQiCiAgICAgICAgc2F2aW5nTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuYWNjZXNzQ29uZmlnLmxvYWRpbmciCiAgICAgICAgc2F2ZT0idmVyaWZ5QWNjZXNzS2V5cyIKICAgICAgICBjYW5jZWw9Y2xvc2UKICAgICAgfX0KICAgIHt7ZWxzZSBpZiAoZXEgc3RlcCAyKX19CiAgICAgIHt7I2FjY29yZGlvbi1saXN0LWl0ZW0KICAgICAgICB0aXRsZT1jbHVzdGVyQ29uZmlnVGl0bGUKICAgICAgICBkZXRhaWw9Y2x1c3RlckNvbmZpZ0RldGFpbAogICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgICBleHBhbmRPbkluaXQ9dHJ1ZQogICAgICB9fQogICAgICAgIHt7I2lmIChlcSBtb2RlICJuZXciKX19CiAgICAgICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Muem9uZS5sYWJlbCJ9fQogICAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5CiAgICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLmV4b3NjYWxlRW5naW5lQ29uZmlnLnpvbmUKICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgICAge3tuZXctc2VsZWN0CiAgICAgICAgICAgICAgICAgIGNsYXNzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ9em9uZUNob2lzZXMKICAgICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy56b25lCiAgICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmt1YmVybmV0ZXNWZXJzaW9uLmxhYmVsIn19CiAgICAgICAgICAgICAgICB7e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICAgIGVkaXRhYmxlPXRydWUKICAgICAgICAgICAgICAgIHZhbHVlPWNsdXN0ZXIuZXhvc2NhbGVFbmdpbmVDb25maWcua3ViZXJuZXRlc1ZlcnNpb24KICAgICAgICAgICAgICB9fQogICAgICAgICAgICAgICAge3tuZXctc2VsZWN0CiAgICAgICAgICAgICAgICAgIGNsYXNzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ9azhzVmVyc2lvbkNob2lzZXMKICAgICAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5rdWJlcm5ldGVzVmVyc2lvbgogICAgICAgICAgICAgICAgfX0KICAgICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICB7ey9pZn19CiAgICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmxldmVsLmxhYmVsIn19CiAgICAgICAgICAgICAge3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICAgIHt7I2lucHV0LW9yLWRpc3BsYXkKICAgICAgICAgICAgICBlZGl0YWJsZT10cnVlCiAgICAgICAgICAgICAgdmFsdWU9Y2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5sZXZlbAogICAgICAgICAgICB9fQogICAgICAgICAgICAgIHt7bmV3LXNlbGVjdAogICAgICAgICAgICAgICAgY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIGNvbnRlbnQ9bGV2ZWxDaG9pc2VzCiAgICAgICAgICAgICAgICB2YWx1ZT1jbHVzdGVyLmV4b3NjYWxlRW5naW5lQ29uZmlnLmxldmVsCiAgICAgICAgICAgICAgfX0KICAgICAgICAgICAge3svaW5wdXQtb3ItZGlzcGxheX19CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICB7eyEtLSBUT0RPKHBlaikgQUREIFRBSU5UUyBIRVJFIC0tfX0KCiAgICAgICAgICB7eyEtLSA8ZGl2IGNsYXNzPSJoZWFkZXIgbXQtMjAgY2xlYXJmaXgiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJwdWxsLWxlZnQiPgogICAgICAgICAgICAgIDxoMiBjbGFzcz0ibWItMCI+CiAgICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MubGFiZWxzLmxhYmVsIn19CiAgICAgICAgICAgICAgPC9oMj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTUiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmxhYmVscy5uZXdMYWJlbCJ9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5IGVkaXRhYmxlPXRydWUgdmFsdWU9bmV3TGFiZWx9fQogICAgICAgICAgICAgIHt7aW5wdXQKICAgICAgICAgICAgICAgIHR5cGU9InRleHQiCiAgICAgICAgICAgICAgICBuYW1lPSJsYWJlbHMiCiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0odCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5sYWJlbHMucGxhY2Vob2xkZXIiKQogICAgICAgICAgICAgICAgdmFsdWU9bmV3TGFiZWwKICAgICAgICAgICAgICB9fQogICAgICAgICAgICB7ey9pbnB1dC1vci1kaXNwbGF5fX0KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMSI+CiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9ImJ0biBiZy1wcmltYXJ5IGJ0bi1zbSBtdC0zMCIge3thY3Rpb24gImFkZE5ld0xhYmVsIn19PgogICAgICAgICAgICAgIDxpIGNsYXNzPSJpY29uIGljb24tcGx1cyI+PC9pPgogICAgICAgICAgICA8L2J1dHRvbj4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9InNrcy1sYWJlbHMiPgogICAgICAgICAgICAgIHt7I2VhY2ggY2x1c3Rlci5leG9zY2FsZUVuZ2luZUNvbmZpZy5sYWJlbHMgYXMgfGxhYmVsIGxhYmVsSWR4fH19CiAgICAgICAgICAgICAgICA8IS0tICAgICBzaW5nbGUgbGFiZWwgc3RhcnQgLS0+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJza3MtbGFiZWwgYmctcHJpbWFyeSI+CiAgICAgICAgICAgICAgICAgIDxzcGFuPgogICAgICAgICAgICAgICAgICAgIHt7bGFiZWx9fQogICAgICAgICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAgICAgICAgICBjbGFzcz0ic2tzLWRlbGV0ZSBiZy1lcnJvciIKICAgICAgICAgICAgICAgICAgICB7e2FjdGlvbiAiZGVsZXRlTGFiZWwiIGxhYmVsSWR4fX0KICAgICAgICAgICAgICAgICAgPgogICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSJpY29uIGljb24tdHJhc2giPjwvaT4KICAgICAgICAgICAgICAgICAgPC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDwhLS0gICAgIHNpbmdsZSBsYWJlbCBlbmQgIC0tPgogICAgICAgICAgICAgIHt7ZWxzZX19CiAgICAgICAgICAgICAgICBObyBsYWJlbHMgYWRkZWQKICAgICAgICAgICAgICB7ey9lYWNofX0KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4gLS19fQogICAgICAgIDwvZGl2PgogICAgICB7ey9hY2NvcmRpb24tbGlzdC1pdGVtfX0KICAgICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgICB7e3NhdmUtY2FuY2VsCiAgICAgICAgYnRuTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3MuY2x1c3RlckNvbmZpZy5uZXh0IgogICAgICAgIHNhdmluZ0xhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLmNsdXN0ZXJDb25maWcubG9hZGluZyIKICAgICAgICBzYXZlPSJ2ZXJpZnlDbHVzdGVyQ29uZmlnIgogICAgICAgIGNhbmNlbD1jbG9zZQogICAgICB9fQogICAge3tlbHNlIGlmIChlcSBzdGVwIDMpfX0KICAgICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICAgIHRpdGxlPW5vZGVQb29sQ29uZmlnVGl0bGUKICAgICAgICBkZXRhaWw9bm9kZVBvb2xDb25maWdEZXRhaWwKICAgICAgICBleHBhbmRBbGw9ZXhwYW5kQWxsCiAgICAgICAgZXhwYW5kPShhY3Rpb24gZXhwYW5kRm4pCiAgICAgICAgZXhwYW5kT25Jbml0PXRydWUKICAgICAgfX0KICAgICAgICB7eyEgc2VsZWN0IG5vZGUgcG9vbCB9fQogICAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi00Ij4KICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5zZWxlY3RlZE5vZGVQb29sVHlwZS5sYWJlbCJ9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7eyNpbnB1dC1vci1kaXNwbGF5IGVkaXRhYmxlPXRydWUgdmFsdWU9c2VsZWN0ZWROb2RlUG9vbFR5cGV9fQogICAgICAgICAgICAgIHt7bmV3LXNlbGVjdAogICAgICAgICAgICAgICAgY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICAgIGNvbnRlbnQ9bm9kZVBvb2xDaG9pc2VzCiAgICAgICAgICAgICAgICB2YWx1ZT1zZWxlY3RlZE5vZGVQb29sVHlwZQogICAgICAgICAgICAgIH19CiAgICAgICAgICAgIHt7L2lucHV0LW9yLWRpc3BsYXl9fQogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xIj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICBEaXNrIFNpemU6CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8SW5wdXQKICAgICAgICAgICAgICBAdHlwZT0ibnVtYmVyIgogICAgICAgICAgICAgIEBtaW49IjUwIgogICAgICAgICAgICAgIEB2YWx1ZT17e3RoaXMuc2VsZWN0ZWROb2RlUG9vbE9iai5kaXNrU2l6ZX19CiAgICAgICAgICAgIC8+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTEiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIFNpemU6CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8SW5wdXQKICAgICAgICAgICAgICBAdHlwZT0ibnVtYmVyIgogICAgICAgICAgICAgIEBtaW49IjEiCiAgICAgICAgICAgICAgQHZhbHVlPXt7dGhpcy5zZWxlY3RlZE5vZGVQb29sT2JqLnNpemV9fQogICAgICAgICAgICAvPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xIj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iYWNjLWxhYmVsIHBiLTEwIj4KICAgICAgICAgICAgICBBY3Rpb25zCiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8YnV0dG9uCiAgICAgICAgICAgICAgY2xhc3M9ImJ0biBiZy1wcmltYXJ5IGljb24tYnRuIHAtMCIKICAgICAgICAgICAgICB7e2FjdGlvbiAiYWRkU2VsZWN0ZWROb2RlUG9vbCJ9fQogICAgICAgICAgICA+CiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9ImRhcmtlbiI+CiAgICAgICAgICAgICAgICA8aSBjbGFzcz0iaWNvbiBpY29uLXBsdXMgdGV4dC1zbWFsbCI+PC9pPgogICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgICA8c3Bhbj4KICAgICAgICAgICAgICAgIEFkZCBOb2RlIFBvb2wKICAgICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgIDwvYnV0dG9uPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iZW1iZXItdmlldyI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJoZWFkZXIgbXQtMjAgY2xlYXJmaXgiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJwdWxsLWxlZnQiPgogICAgICAgICAgICAgIDxoMiBjbGFzcz0ibWItMCI+CiAgICAgICAgICAgICAgICB7e3QgImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xzLmxhYmVsIn19CiAgICAgICAgICAgICAgPC9oMj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImdyaWQgc29ydGFibGUtdGFibGUgZW1iZXItdmlldyI+CiAgICAgICAgICAgIDx0YWJsZSBjbGFzcz0iZml4ZWQgZ3JpZCBzb3J0YWJsZS10YWJsZSI+CiAgICAgICAgICAgICAgPHRoZWFkPgogICAgICAgICAgICAgICAgPHRyIGNsYXNzPSJmaXhlZC1oZWFkZXIiPgogICAgICAgICAgICAgICAgICA8dGggbGFzcz0ic29ydGFibGUgZW1iZXItdmlldyIgcm9sZT0iY29sdW1uaGVhZGVyIj4KICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz0iYnRuIGJnLXRyYW5zcGFyZW50Ij4KICAgICAgICAgICAgICAgICAgICAgIExhYmVsCiAgICAgICAgICAgICAgICAgICAgPC9hPgogICAgICAgICAgICAgICAgICA8L3RoPgogICAgICAgICAgICAgICAgICA8dGggbGFzcz0ic29ydGFibGUgZW1iZXItdmlldyIgcm9sZT0iY29sdW1uaGVhZGVyIj4KICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz0iYnRuIGJnLXRyYW5zcGFyZW50Ij4KICAgICAgICAgICAgICAgICAgICAgIERpc2sgU2l6ZQogICAgICAgICAgICAgICAgICAgIDwvYT4KICAgICAgICAgICAgICAgICAgPC90aD4KICAgICAgICAgICAgICAgICAgPHRoIGxhc3M9InNvcnRhYmxlIGVtYmVyLXZpZXciIHJvbGU9ImNvbHVtbmhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9ImJ0biBiZy10cmFuc3BhcmVudCI+CiAgICAgICAgICAgICAgICAgICAgICBTaXplCiAgICAgICAgICAgICAgICAgICAgPC9hPgogICAgICAgICAgICAgICAgICA8L3RoPgogICAgICAgICAgICAgICAgICA8dGggbGFzcz0ic29ydGFibGUgZW1iZXItdmlldyIgcm9sZT0iY29sdW1uaGVhZGVyIj4KICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz0iYnRuIGJnLXRyYW5zcGFyZW50Ij48L2E+CiAgICAgICAgICAgICAgICAgIDwvdGg+CiAgICAgICAgICAgICAgICA8L3RyPgogICAgICAgICAgICAgIDwvdGhlYWQ+CiAgICAgICAgICAgICAgPHRib2R5PgogICAgICAgICAgICAgICAge3sjZWFjaCB0aGlzLnNlbGVjdGVkTm9kZVBvb2xMaXN0IGFzIHxzZWxlY3RlZE5vZGVQb29sfH19CiAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz0ibWFpbi1yb3cgZW1iZXItdmlldyI+CiAgICAgICAgICAgICAgICAgICAgPHRkPgogICAgICAgICAgICAgICAgICAgICAge3tzZWxlY3RlZE5vZGVQb29sLmxhYmVsfX0KICAgICAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICAgICAgICAgIDx0ZD4KICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXQKICAgICAgICAgICAgICAgICAgICAgICAgQHR5cGU9Im51bWJlciIKICAgICAgICAgICAgICAgICAgICAgICAgQG1pbj0iNTAiCiAgICAgICAgICAgICAgICAgICAgICAgIEB2YWx1ZT17e3NlbGVjdGVkTm9kZVBvb2wuZGlza1NpemV9fQogICAgICAgICAgICAgICAgICAgICAgLz4KICAgICAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICAgICAgICAgIDx0ZD4KICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dAogICAgICAgICAgICAgICAgICAgICAgICBAdHlwZT0ibnVtYmVyIgogICAgICAgICAgICAgICAgICAgICAgICBAbWluPSIxIgogICAgICAgICAgICAgICAgICAgICAgICBAdmFsdWU9e3tzZWxlY3RlZE5vZGVQb29sLnNpemV9fQogICAgICAgICAgICAgICAgICAgICAgLz4KICAgICAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0idGV4dC1jZW50ZXIiPgogICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbgogICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz0iYnRuIGJnLWVycm9yIGJ0bi1zbSIKICAgICAgICAgICAgICAgICAgICAgICAge3thY3Rpb24gImRlbGV0ZU5vZGVQb29sIiBzZWxlY3RlZE5vZGVQb29sLmlkfX0KICAgICAgICAgICAgICAgICAgICAgID4KICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi10cmFzaCI+PC9pPgogICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgPC90ZD4KICAgICAgICAgICAgICAgICAgPC90cj4KICAgICAgICAgICAgICAgIHt7ZWxzZX19CiAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz0ibWFpbi1yb3cgZW1iZXItdmlldyI+CiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49IjgiIGNsYXNzPSJwLTEwIHRleHQtY2VudGVyIj4KICAgICAgICAgICAgICAgICAgICAgIHt7dCAiY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbHMuZW1wdHkifX0KICAgICAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICAgICAgICA8L3RyPgogICAgICAgICAgICAgICAge3svZWFjaH19CiAgICAgICAgICAgICAgPC90Ym9keT4KICAgICAgICAgICAgPC90YWJsZT4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIHt7ISBzaG93IHNlbGVjdGVkIG5vZGUgcG9vbHMgZW5kIH19CiAgICAgIHt7L2FjY29yZGlvbi1saXN0LWl0ZW19fQogICAgICB7e3RvcC1lcnJvcnMgZXJyb3JzPWVycm9yc319CiAgICAgIHt7I2lmIChlcSBtb2RlICJlZGl0Iil9fQogICAgICAgIHt7c2F2ZS1jYW5jZWwKICAgICAgICAgIGJ0bkxhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29sQ29uZmlnLnVwZGF0ZSIKICAgICAgICAgIHNhdmluZ0xhYmVsPSJjbHVzdGVyTmV3LmV4b3NjYWxlc2tzLm5vZGVQb29sQ29uZmlnLmxvYWRpbmciCiAgICAgICAgICBzYXZlPSJ1cGRhdGVDbHVzdGVyIgogICAgICAgICAgY2FuY2VsPWNsb3NlCiAgICAgICAgfX0KICAgICAge3tlbHNlfX0KICAgICAgICB7e3NhdmUtY2FuY2VsCiAgICAgICAgICBidG5MYWJlbD0iY2x1c3Rlck5ldy5leG9zY2FsZXNrcy5ub2RlUG9vbENvbmZpZy5uZXh0IgogICAgICAgICAgc2F2aW5nTGFiZWw9ImNsdXN0ZXJOZXcuZXhvc2NhbGVza3Mubm9kZVBvb2xDb25maWcubG9hZGluZyIKICAgICAgICAgIHNhdmU9ImNyZWF0ZUNsdXN0ZXIiCiAgICAgICAgICBjYW5jZWw9Y2xvc2UKICAgICAgICB9fQogICAgICB7ey9pZn19CiAgICB7ey9pZn19CiAge3svYWNjb3JkaW9uLWxpc3R9fQo8L3NlY3Rpb24+';
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
