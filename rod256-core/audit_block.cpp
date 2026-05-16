#include "audit_block.hpp"
#include <iostream>
#include <sstream>
#include <ctime>
#include <iomanip>

AuditBlock::AuditBlock(
    int index,
    const std::string& username,
    const std::string& status,
    const std::string& ipAddress,
    const std::string& timestamp,
    const std::string& previousHash
) {
    this->index = index;
    this->username = username;
    this->status = status;
    this->ipAddress = ipAddress;
    this->timestamp = timestamp;
    this->previousHash = previousHash;
    this->currentHash = "";
}

std::string AuditBlock::buildBlockData() const {
    std::stringstream data;

    data << index
         << username
         << status
         << ipAddress
         << timestamp
         << previousHash;

    return data.str();
}

void AuditBlock::calculateHash(Rod256Hasher& hasher) {
    std::string blockData = buildBlockData();
    currentHash = hasher.hash(blockData, previousHash);
}

std::string AuditBlock::getCurrentHash() const {
    return currentHash;
}

std::string AuditBlock::getPreviousHash() const {
    return previousHash;
}

std::string AuditBlock::getBlockData() const {
    return buildBlockData();
}

void AuditBlock::print() const {
    std::cout << "----------------------------------------\n";
    std::cout << "Block Index   : " << index << "\n";
    std::cout << "Username      : " << username << "\n";
    std::cout << "Status        : " << status << "\n";
    std::cout << "IP Address    : " << ipAddress << "\n";
    std::cout << "Timestamp     : " << timestamp << "\n";
    std::cout << "Previous Hash : " << previousHash << "\n";
    std::cout << "Current Hash  : " << currentHash << "\n";
}

AuditLedger::AuditLedger() {
    AuditBlock genesisBlock(
        0,
        "SYSTEM",
        "GENESIS_BLOCK",
        "0.0.0.0",
        getCurrentTimestamp(),
        "0000000000000000000000000000000000000000000000000000000000000000"
    );

    genesisBlock.calculateHash(hasher);
    chain.push_back(genesisBlock);
}

std::string AuditLedger::getCurrentTimestamp() const {
    std::time_t now = std::time(nullptr);
    std::tm timeInfo;

#ifdef _WIN32
    localtime_s(&timeInfo, &now);
#else
    localtime_r(&now, &timeInfo);
#endif

    std::stringstream timestamp;
    timestamp << std::put_time(&timeInfo, "%Y-%m-%d %H:%M:%S");

    return timestamp.str();
}

void AuditLedger::addLoginEvent(
    const std::string& username,
    const std::string& status,
    const std::string& ipAddress
) {
    int newIndex = chain.size();
    std::string previousHash = chain.back().getCurrentHash();

    AuditBlock newBlock(
        newIndex,
        username,
        status,
        ipAddress,
        getCurrentTimestamp(),
        previousHash
    );

    newBlock.calculateHash(hasher);
    chain.push_back(newBlock);
}

bool AuditLedger::verifyChain() const {
    for (size_t i = 1; i < chain.size(); i++) {
        if (chain[i].getPreviousHash() != chain[i - 1].getCurrentHash()) {
            return false;
        }
    }

    return true;
}

void AuditLedger::printLedger() const {
    for (const AuditBlock& block : chain) {
        block.print();
    }

    std::cout << "----------------------------------------\n";

    if (verifyChain()) {
        std::cout << "Ledger verification: VALID\n";
    } else {
        std::cout << "Ledger verification: INVALID\n";
    }
}
