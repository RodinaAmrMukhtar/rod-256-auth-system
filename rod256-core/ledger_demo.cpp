#include <iostream>
#include "audit_block.hpp"

int main() {
    AuditLedger ledger;

    ledger.addLoginEvent("rodina", "LOGIN_SUCCESS", "192.168.1.10");
    ledger.addLoginEvent("admin", "LOGIN_FAILED", "192.168.1.20");
    ledger.addLoginEvent("rodina", "LOGIN_SUCCESS", "192.168.1.10");

    ledger.printLedger();

    return 0;
}
