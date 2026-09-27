#include <iostream>
#include <pcap.h>

int main() {
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_if_t *interfaces;

    // Attempt to find all available network devices
    if (pcap_findalldevs(&interfaces, errbuf) == -1) {
        std::cerr << "Error finding devices: " << errbuf << std::endl;
        return 1;
    }

    std::cout << "Successfully linked libpcap. Available capture interfaces:" << std::endl;
    
    // Loop through and print the available interfaces
    for(pcap_if_t *d = interfaces; d != nullptr; d = d->next) {
        std::cout << " - " << (d->description ? d->description : d->name) << std::endl;
    }

    // Free the device list memory
    pcap_freealldevs(interfaces);
    
    return 0;
}