#ifndef AUDIT_BLOCK_HPP
#define AUDIT_BLOCK_HPP

#include <string>
#include <vector>
#include "rod256.hpp"

class AuditBlock {
private:
    int index;
    std::string username;
    std::string status;
    std::string ipAddress;
    std::string timestamp;
    std::string previousHash;
    std::string currentHash;

    std::string buildBlockData() const;

public:
    AuditBlock(
        int index,
        const std::string& username,
        const std::string& status,
        const std::string& ipAddress,
        const std::string& timestamp,
        const std::string& previousHash
    );

    void calculateHash(Rod256Hasher& hasher);

    std::string getCurrentHash() const;
    std::string getPreviousHash() const;
    std::string getBlockData() const;

    void print() const;
};

class AuditLedger {
private:
    std::vector<AuditBlock> chain;
    Rod256Hasher hasher;

    std::string getCurrentTimestamp() const;

public:
    AuditLedger();

    void addLoginEvent(
        const std::string& username,
        const std::string& status,
        const std::string& ipAddress
    );

    bool verifyChain() const;
    void printLedger() const;
};

#endif
