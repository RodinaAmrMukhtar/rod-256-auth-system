#ifndef ROD256_HPP
#define ROD256_HPP

#include <array>
#include <cstdint>
#include <string>

class Rod256Hasher {
private:
    static const int STATE_SIZE = 8;
    static const int ROUNDS = 64;

    std::array<uint32_t, STATE_SIZE> state;

    uint32_t rotateLeft(uint32_t value, int shift);
    uint32_t rotateRight(uint32_t value, int shift);
    uint32_t roundConstant(int round);
    void resetState();
    void mixCharacter(uint32_t value);

public:
    Rod256Hasher();

    std::string hash(const std::string& message, const std::string& salt);
};

#endif
