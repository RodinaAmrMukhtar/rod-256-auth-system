#include "rod256.hpp"
#include <sstream>
#include <iomanip>

Rod256Hasher::Rod256Hasher() {
    resetState();
}

void Rod256Hasher::resetState() {
    state = {
        0x243F6A88, 0x85A308D3,
        0x13198A2E, 0x03707344,
        0xA4093822, 0x299F31D0,
        0x082EFA98, 0xEC4E6C89
    };
}

uint32_t Rod256Hasher::rotateLeft(uint32_t value, int shift) {
    return (value << shift) | (value >> (32 - shift));
}

uint32_t Rod256Hasher::rotateRight(uint32_t value, int shift) {
    return (value >> shift) | (value << (32 - shift));
}

uint32_t Rod256Hasher::roundConstant(int round) {
    return 0x9E3779B9 ^ (round * 0x7F4A7C15);
}

void Rod256Hasher::mixCharacter(uint32_t value) {
    for (int round = 0; round < ROUNDS; round++) {
        int index = round % STATE_SIZE;

        uint32_t mix = state[index] ^ value ^ roundConstant(round);

        mix = rotateLeft(mix, 7);
        mix = mix + rotateRight(state[(index + 1) % STATE_SIZE], 11);
        mix = mix ^ rotateLeft(state[(index + 3) % STATE_SIZE], 17);

        state[index] = state[index] ^ mix;
        state[index] = state[index] + rotateLeft(value + round, (round % 31) + 1);
    }
}

std::string Rod256Hasher::hash(const std::string& message, const std::string& salt) {
    resetState();

    std::string data = message + salt;

    for (char character : data) {
        uint32_t value = static_cast<uint32_t>(static_cast<unsigned char>(character));
        mixCharacter(value);
    }

    std::stringstream result;

    for (uint32_t part : state) {
        result << std::hex << std::setw(8) << std::setfill('0') << part;
    }

    return result.str();
}
