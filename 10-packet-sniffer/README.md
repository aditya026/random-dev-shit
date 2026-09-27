| Stage | Library | What it gives you | Install |
|---|---|---|---|
| **Capture** | `libpcap` | `pcap_open_live`, `pcap_loop` — the actual packet capture calls | `sudo apt install libpcap-dev` |
| **Parsing** | system headers | `<netinet/if_ether.h>`, `<netinet/ip.h>`, `<netinet/tcp.h>`, `<netinet/udp.h>`, `<arpa/inet.h>` — header struct definitions, already on your system | none needed — standard on Linux |
| **Flow tracking** | STL only | `std::unordered_map`, `std::mutex`, `std::thread`, `std::chrono` — no external dependency | already in the standard library |
| **Storage** | `sqlite3` | the C API directly, or a thin wrapper like `SQLiteCpp` for less boilerplate | `sudo apt install libsqlite3-dev` |
| **JSON (for the API)** | `nlohmann/json` | serializing flow/alert data to send to the dashboard — header-only, drop it in | `sudo apt install nlohmann-json3-dev` |
| **Dashboard backend** | `cpp-httplib` | a header-only HTTP server — enough to serve a REST API and a static HTML page without pulling in a heavy framework | single header, grab from GitHub, no package needed |