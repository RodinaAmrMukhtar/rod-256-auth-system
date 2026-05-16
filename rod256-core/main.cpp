#include <iostream>
#include <string>
#include "rod256.hpp"

int main() {
    Rod256Hasher hasher;

    std::string message;
    std::string salt;

    std::cout << "Enter message/password: ";
    std::getline(std::cin, message);

    std::cout << "Enter salt: ";
    std::getline(std::cin, salt);

    std::string hashValue = hasher.hash(message, salt);

    std::cout << "\nROD-256 Hash:\n";
    std::cout << hashValue << std::endl;

    std::cout << "\nHash length: " << hashValue.length() << " hex characters" << std::endl;

    return 0;
}
