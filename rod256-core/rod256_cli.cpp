#include <iostream>
#include <string>
#include "rod256.hpp"

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: rod256_cli <message> <salt>" << std::endl;
        return 1;
    }

    std::string message = argv[1];
    std::string salt = argv[2];

    Rod256Hasher hasher;
    std::string hashValue = hasher.hash(message, salt);

    std::cout << hashValue << std::endl;

    return 0;
}
