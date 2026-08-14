# Bluetooth jammer
## Basics
* Bluetooth operates in the 2.4 GHz ISM band.
* Two major types:
  * Bluetooth Classic
  * Bluetooth Low Energy (BLE)

Strong interference → legitimate signal gets drowned out → communication fails.

| Feature            | Bluetooth Classic       | BLE                                  |
| ------------------ | ----------------------- | ------------------------------------ |
| Frequency          | 2.4 GHz                 | 2.4 GHz                              |
| Channels           | 79                      | 40                                   |
| Channel range      | 2402–2480 MHz           | 2402–2480 MHz                        |
| Channel behavior   | Rapid frequency hopping | Uses designated advertising channels |
| Hopping            | ~1600 hops/sec          | Not the same hopping mechanism       |
| Jamming difficulty | Higher                  | Lower for advertising/discovery      |

#### Bluetooth Classic
* Uses 79 channels.
* Rapidly hops between channels.
* Approximately 1600 hops per second.
* Because the communication changes channels quickly, targeted interference is more difficult.
#### BLE

has 40 channels, including 3 primary advertising channels:
* 2402 MHz
* 2426 MHz
* 2480 MHz

These advertising channels are important because devices use them for discovery and connection establishment.


## How RF Jamming Works
```
┌──────────────────────────────┐
│   Legitimate Bluetooth Signal│
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│         RF Spectrum          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│     Strong Interference      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Signal Difficult / Impossible│
│          to Decode           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│     Communication Fails      │
└──────────────────────────────┘

```

### Hardware for Controlled Chaos
A microcontroller and a $10 transceiver
* nRF24L01 (2.4 GHz radio module, can be turned into a jammer) 
## Components Required

| S No | Item | Quantity | Description |
|------|------|----------|-------------|
| 1 | ESP32 | 1 | Acts as the central controller of the whole circuit |
| 2 | NRF24L01 + PA + LNA | 2 | To transmit the radio signals |
| 3 | Switch | 1 | To turn on and off the circuit |
| 4 | 3.7V LiPo Battery | 1 | To power up the circuit |
| 5 | 5mm LED | 1 | Status indicator for the ESP32 Bluetooth jammer |
| 6 | 220Ω Resistor | 1 | To limit the current going to the LED |
| 7 | Dotted PCB | 1 | To assemble the whole circuit |
* https://circuitdigest.com/tutorial/esp32-bluetooth-jammer-using-nrf24l01



### source
* https://github.com/cifertech/RF-Clown
