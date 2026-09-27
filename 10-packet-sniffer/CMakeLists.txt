cmake_minimum_required(VERSION 3.10)
project(PacketAnalyzer)

# Require C++17 minimum as per the project roadmap
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Locate the libraries installed via vcpkg
find_package(pcap REQUIRED)
find_package(unofficial-sqlite3 CONFIG REQUIRED)
find_package(httplib NAMES cpp-httplib REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

# Define the executable and source files
add_executable(analyzer src/main.cpp)

# Link the libraries to your executable
target_link_libraries(analyzer PRIVATE 
    pcap 
    unofficial::sqlite3::sqlite3 
    cpp-httplib::cpp-httplib 
    nlohmann_json::nlohmann_json
)