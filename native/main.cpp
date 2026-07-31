#include <napi.h>
#include <windows.h>
#include <psapi.h>
#include <powrprof.h>
#include <string>
#include <stdio.h>

const GUID MY_GUID_MIN_POWER_SAVINGS = { 0x8c5e7fda, 0xe8bf, 0x4a96, { 0x9a, 0x85, 0xa6, 0xe2, 0x3a, 0x8c, 0x63, 0x5c } };
const GUID MY_GUID_TYPICAL_POWER_SAVINGS = { 0x381b4222, 0xf694, 0x41f0, { 0x96, 0x85, 0xff, 0x5b, 0xb2, 0x60, 0xdf, 0x2e } };
const GUID MY_GUID_PROCESSOR_SETTINGS_SUBGROUP = { 0x54533251, 0x82be, 0x4824, { 0x96, 0xc1, 0x47, 0xb6, 0x0b, 0x74, 0x0d, 0x00 } };
const GUID MY_GUID_PROCESSOR_THROTTLE_MINIMUM = { 0x893dee8e, 0x2bef, 0x41e0, { 0x89, 0xc6, 0xb5, 0x5d, 0x09, 0x29, 0x96, 0x4c } };
const GUID MY_GUID_USB_SETTINGS_SUBGROUP = { 0x2a737441, 0x1930, 0x4402, { 0x8d, 0x77, 0xb2, 0xbe, 0xbb, 0xa3, 0x08, 0xa3 } };
const GUID MY_GUID_USB_SETTING_SELECTIVE_SUSPEND = { 0x48e6b7a6, 0x50f5, 0x4782, { 0xa5, 0xd4, 0x53, 0xbb, 0x8f, 0x07, 0xe2, 0x26 } };
const GUID MY_GUID_PCIEXPRESS_SETTINGS_SUBGROUP = { 0x501a4d13, 0x42af, 0x4429, { 0x9f, 0xd1, 0xa8, 0x21, 0x8c, 0x26, 0x8e, 0x20 } };
const GUID MY_GUID_ASPM_SETTING = { 0xee12f906, 0xd277, 0x404b, { 0xb6, 0xda, 0xe5, 0xfa, 0x1a, 0x57, 0x6d, 0xf5 } };
const GUID MY_GUID_NETWORK_SETTINGS_SUBGROUP = { 0x19cbb8fa, 0x5279, 0x450e, { 0x9f, 0xac, 0x8a, 0x3d, 0x5f, 0xed, 0xd0, 0xc1 } };
const GUID MY_GUID_NETWORK_POWER_MODE = { 0x12bbebe6, 0x58d6, 0x4636, { 0x95, 0xbb, 0x32, 0x17, 0xef, 0x86, 0x7c, 0x1a } };

const GUID MY_GUID_PROCESSOR_PERF_ENERGY_PREFERENCE = { 0x36687f9e, 0xe3a5, 0x4dbf, { 0xb1, 0xdc, 0x15, 0xeb, 0x38, 0x1c, 0x68, 0x63 } };
const GUID MY_GUID_PROCESSOR_PERF_INCREASE_THRESHOLD = { 0x06cadf0e, 0x64ed, 0x448a, { 0x89, 0x27, 0xce, 0x7b, 0xf9, 0x0e, 0xb3, 0x5d } };
const GUID MY_GUID_PROCESSOR_IDLE_DEMOTE_THRESHOLD = { 0x4b92d758, 0x5a24, 0x4851, { 0xa4, 0x70, 0x81, 0x5d, 0x78, 0xae, 0xe1, 0x19 } };
const GUID MY_GUID_DISK_SUBGROUP = { 0x0012ee47, 0x9041, 0x4b5d, { 0x9b, 0x77, 0x53, 0x5f, 0xba, 0x8b, 0x14, 0x42 } };
const GUID MY_GUID_DISK_POWERDOWN_TIMEOUT = { 0x6738e2c4, 0xe8a5, 0x4a42, { 0xb1, 0x6a, 0xe0, 0x40, 0xe7, 0x69, 0x75, 0x6e } };
const GUID MY_GUID_DISK_SATA_MAC_TOLERANCE = { 0x0b2d69d7, 0xa2a1, 0x449c, { 0x96, 0x80, 0xf9, 0x1c, 0x70, 0x52, 0x1c, 0x60 } };

std::string GuidToString(const GUID& guid) {
    char guidStr[40];
    snprintf(guidStr, sizeof(guidStr), "{%08lX-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}",
        guid.Data1, guid.Data2, guid.Data3,
        guid.Data4[0], guid.Data4[1], guid.Data4[2], guid.Data4[3],
        guid.Data4[4], guid.Data4[5], guid.Data4[6], guid.Data4[7]);
    return std::string(guidStr);
}

bool StringToGuid(const std::string& str, GUID* guid) {
    if (str.length() < 36) return false;
    unsigned long p0;
    unsigned int p1, p2, p3[8];
    int n = sscanf(str.c_str(), "{%08lX-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}",
        &p0, &p1, &p2, &p3[0], &p3[1], &p3[2], &p3[3], &p3[4], &p3[5], &p3[6], &p3[7]);
    if (n != 11) {
        n = sscanf(str.c_str(), "%08lX-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X",
            &p0, &p1, &p2, &p3[0], &p3[1], &p3[2], &p3[3], &p3[4], &p3[5], &p3[6], &p3[7]);
        if (n != 11) return false;
    }
    guid->Data1 = p0;
    guid->Data2 = p1;
    guid->Data3 = p2;
    for (int i = 0; i < 8; ++i) guid->Data4[i] = (unsigned char)p3[i];
    return true;
}

// NtSetTimerResolution signature
typedef NTSTATUS(NTAPI* NtSetTimerResolution_t)(
    ULONG DesiredResolution,
    BOOLEAN SetResolution,
    PULONG CurrentResolution
);

Napi::Value SetTimerResolution(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsBoolean()) {
        Napi::TypeError::New(env, "Invalid arguments: expected (uint32, boolean)").ThrowAsJavaScriptException();
        return env.Null();
    }

    ULONG desired = info[0].As<Napi::Number>().Uint32Value();
    BOOLEAN enable = info[1].As<Napi::Boolean>().Value() ? TRUE : FALSE;

    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    if (!hNtdll) {
        return Napi::Boolean::New(env, false);
    }

    NtSetTimerResolution_t pNtSetTimerResolution = (NtSetTimerResolution_t)GetProcAddress(hNtdll, "NtSetTimerResolution");
    if (!pNtSetTimerResolution) {
        return Napi::Boolean::New(env, false);
    }

    ULONG currentRes;
    NTSTATUS status = pNtSetTimerResolution(desired, enable, &currentRes);

    return Napi::Boolean::New(env, status == 0);
}

bool EnablePrivilege(LPCSTR privilegeName) {
    HANDLE hToken;
    if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken)) {
        return false;
    }

    LUID luid;
    if (!LookupPrivilegeValueA(NULL, privilegeName, &luid)) {
        CloseHandle(hToken);
        return false;
    }

    TOKEN_PRIVILEGES tp;
    tp.PrivilegeCount = 1;
    tp.Privileges[0].Luid = luid;
    tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;

    if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(TOKEN_PRIVILEGES), NULL, NULL)) {
        CloseHandle(hToken);
        return false;
    }

    CloseHandle(hToken);
    return GetLastError() == ERROR_SUCCESS;
}

Napi::Value GlobalMemoryClean(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    EnablePrivilege(SE_DEBUG_NAME);

    DWORD aProcesses[1024], cbNeeded, cProcesses;
    if (!EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded)) {
        return Napi::Boolean::New(env, false);
    }

    cProcesses = cbNeeded / sizeof(DWORD);

    for (unsigned int i = 0; i < cProcesses; i++) {
        if (aProcesses[i] != 0) {
            HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_SET_QUOTA, FALSE, aProcesses[i]);
            if (hProcess != NULL) {
                EmptyWorkingSet(hProcess);
                CloseHandle(hProcess);
            }
        }
    }

    return Napi::Boolean::New(env, true);
}

Napi::Value SetProcessPriority(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Invalid arguments: expected (uint32, uint32)").ThrowAsJavaScriptException();
        return env.Null();
    }

    DWORD pid = info[0].As<Napi::Number>().Uint32Value();
    DWORD priorityClass = info[1].As<Napi::Number>().Uint32Value();

    HANDLE hProcess = OpenProcess(PROCESS_SET_INFORMATION, FALSE, pid);
    if (hProcess == NULL) {
        return Napi::Boolean::New(env, false);
    }

    BOOL success = SetPriorityClass(hProcess, priorityClass);
    CloseHandle(hProcess);

    return Napi::Boolean::New(env, success != 0);
}

Napi::Value EmptyWorkingSetOptimization(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    HANDLE hProcess = GetCurrentProcess();
    bool success = EmptyWorkingSet(hProcess) != 0;
    return Napi::Boolean::New(env, success);
}

Napi::Value WriteRegistry(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 5 || !info[0].IsString() || !info[1].IsString() || !info[2].IsString() || !info[3].IsString()) {
        return Napi::Boolean::New(env, false);
    }

    std::string rootStr = info[0].As<Napi::String>().Utf8Value();
    std::string pathStr = info[1].As<Napi::String>().Utf8Value();
    std::string keyStr = info[2].As<Napi::String>().Utf8Value();
    std::string typeStr = info[3].As<Napi::String>().Utf8Value();

    HKEY hRootKey = NULL;
    if (rootStr == "HKLM") hRootKey = HKEY_LOCAL_MACHINE;
    else if (rootStr == "HKCU") hRootKey = HKEY_CURRENT_USER;
    else if (rootStr == "HKCR") hRootKey = HKEY_CLASSES_ROOT;
    else if (rootStr == "HKU") hRootKey = HKEY_USERS;
    else if (rootStr == "HKCC") hRootKey = HKEY_CURRENT_CONFIG;
    else return Napi::Boolean::New(env, false);

    HKEY hKey;
    LSTATUS status = RegCreateKeyExA(hRootKey, pathStr.c_str(), 0, NULL, REG_OPTION_NON_VOLATILE, KEY_WRITE, NULL, &hKey, NULL);
    if (status != ERROR_SUCCESS) return Napi::Boolean::New(env, false);

    bool success = false;
    if (typeStr == "DWORD" && info[4].IsNumber()) {
        DWORD val = info[4].As<Napi::Number>().Uint32Value();
        status = RegSetValueExA(hKey, keyStr.c_str(), 0, REG_DWORD, (const BYTE*)&val, sizeof(DWORD));
        success = (status == ERROR_SUCCESS);
    } else if (typeStr == "QWORD" && info[4].IsNumber()) {
        uint64_t val = info[4].As<Napi::Number>().Int64Value();
        status = RegSetValueExA(hKey, keyStr.c_str(), 0, REG_QWORD, (const BYTE*)&val, sizeof(uint64_t));
        success = (status == ERROR_SUCCESS);
    } else if (typeStr == "STRING" && info[4].IsString()) {
        std::string val = info[4].As<Napi::String>().Utf8Value();
        status = RegSetValueExA(hKey, keyStr.c_str(), 0, REG_SZ, (const BYTE*)val.c_str(), val.length() + 1);
        success = (status == ERROR_SUCCESS);
    } else if (typeStr == "BINARY") {
        if (info[4].IsBuffer()) {
            Napi::Buffer<uint8_t> buffer = info[4].As<Napi::Buffer<uint8_t>>();
            status = RegSetValueExA(hKey, keyStr.c_str(), 0, REG_BINARY, buffer.Data(), buffer.Length());
            success = (status == ERROR_SUCCESS);
        } else if (info[4].IsString()) {
            std::string val = info[4].As<Napi::String>().Utf8Value();
            status = RegSetValueExA(hKey, keyStr.c_str(), 0, REG_BINARY, (const BYTE*)val.c_str(), val.length());
            success = (status == ERROR_SUCCESS);
        }
    }
    
    RegCloseKey(hKey);
    return Napi::Boolean::New(env, success);
}

Napi::Value DeleteRegistry(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 3 || !info[0].IsString() || !info[1].IsString() || !info[2].IsString()) {
        return Napi::Boolean::New(env, false);
    }

    std::string rootStr = info[0].As<Napi::String>().Utf8Value();
    std::string pathStr = info[1].As<Napi::String>().Utf8Value();
    std::string keyStr = info[2].As<Napi::String>().Utf8Value();

    HKEY hRootKey = NULL;
    if (rootStr == "HKLM") hRootKey = HKEY_LOCAL_MACHINE;
    else if (rootStr == "HKCU") hRootKey = HKEY_CURRENT_USER;
    else if (rootStr == "HKCR") hRootKey = HKEY_CLASSES_ROOT;
    else if (rootStr == "HKU") hRootKey = HKEY_USERS;
    else if (rootStr == "HKCC") hRootKey = HKEY_CURRENT_CONFIG;
    else return Napi::Boolean::New(env, false);

    HKEY hKey;
    LSTATUS status = RegOpenKeyExA(hRootKey, pathStr.c_str(), 0, KEY_SET_VALUE, &hKey);
    if (status != ERROR_SUCCESS) return Napi::Boolean::New(env, false);

    status = RegDeleteValueA(hKey, keyStr.c_str());
    RegCloseKey(hKey);

    return Napi::Boolean::New(env, status == ERROR_SUCCESS);
}

Napi::Value SetServiceState(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
        return Napi::Boolean::New(env, false);
    }

    std::string serviceName = info[0].As<Napi::String>().Utf8Value();
    int state = info[1].As<Napi::Number>().Int32Value();

    SC_HANDLE hSCManager = OpenSCManagerA(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!hSCManager) return Napi::Boolean::New(env, false);

    SC_HANDLE hService = OpenServiceA(hSCManager, serviceName.c_str(), SERVICE_ALL_ACCESS);
    if (!hService) {
        CloseServiceHandle(hSCManager);
        return Napi::Boolean::New(env, false);
    }

    bool success = false;
    if (state == 1) { 
        if (StartServiceA(hService, 0, NULL)) {
            success = true;
        } else if (GetLastError() == ERROR_SERVICE_ALREADY_RUNNING) {
            success = true;
        }
    } else if (state == 0) {
        SERVICE_STATUS_PROCESS ssp;
        if (ControlService(hService, SERVICE_CONTROL_STOP, (LPSERVICE_STATUS)&ssp)) {
            success = true;
        } else if (GetLastError() == ERROR_SERVICE_NOT_ACTIVE) {
            success = true;
        }
    } else if (state == 2) {
        if (ChangeServiceConfigA(hService, SERVICE_NO_CHANGE, SERVICE_DISABLED, SERVICE_NO_CHANGE, NULL, NULL, NULL, NULL, NULL, NULL, NULL)) {
            success = true;
        }
    }

    CloseServiceHandle(hService);
    CloseServiceHandle(hSCManager);

    return Napi::Boolean::New(env, success);
}

Napi::Value CreatePowerPlan(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        return Napi::String::New(env, "");
    }
    
    std::string planNameStr = info[0].As<Napi::String>().Utf8Value();
    
    // Convert to wide string using MultiByteToWideChar
    int wlen = MultiByteToWideChar(CP_UTF8, 0, planNameStr.c_str(), -1, NULL, 0);
    std::wstring planName(wlen, 0);
    MultiByteToWideChar(CP_UTF8, 0, planNameStr.c_str(), -1, &planName[0], wlen);
    
    GUID* pNewScheme = NULL;
    GUID minPowerSavings = { 0x8c5e7fda, 0xe8bf, 0x4a96, { 0x9a, 0x85, 0xa6, 0xe2, 0x3a, 0x8c, 0x63, 0x5c } };
    DWORD res = PowerDuplicateScheme(NULL, &minPowerSavings, &pNewScheme);
    if (res != ERROR_SUCCESS || pNewScheme == NULL) {
        return Napi::String::New(env, "");
    }
    
    // Set friendly name
    PowerWriteFriendlyName(NULL, pNewScheme, NULL, NULL, (UCHAR*)planName.c_str(), (DWORD)(wlen * sizeof(wchar_t)));
    
    auto apply_setting = [&](const char* sub_s, const char* setting_s, DWORD val) {
        GUID sub, setting;
        if (StringToGuid(sub_s, &sub) && StringToGuid(setting_s, &setting)) {
            PowerWriteACValueIndex(NULL, pNewScheme, &sub, &setting, val);
            PowerWriteDCValueIndex(NULL, pNewScheme, &sub, &setting, val);
        }
    };
    
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{893dee8e-2bef-41e0-89c6-b55d0929964c}", 100); // Throttle Min
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{bc5038f7-23e0-4960-96da-33abaf5935ec}", 100); // Throttle Max
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{36687f9e-e3a5-4dbf-b1dc-15eb381c6863}", 0);   // EPP
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{5d76a2ca-e8c0-402f-a133-2158492d58ad}", 1);   // Idle Disable
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{0cc5b647-c1df-4637-891a-dec35c318583}", 100); // Core Parking Min
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{06cadf0e-64ed-448a-8927-ce7bf90eb35d}", 0);   // Increase Threshold
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{12a0ab44-fe28-4fa9-b3bd-4b64f44960a6}", 100); // Decrease Threshold
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{4b92d758-5a24-4851-a470-815d78aee119}", 100); // Idle Demote
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{be337238-0d82-4146-a960-4f3749d470c7}", 2);   // Perf Boost Mode
    apply_setting("{54533251-82be-4824-96c1-47b60b740d00}", "{93b8b6dc-0698-4d1c-9ee4-0644e900c85d}", 0);   // Heterogeneous Thread Sched

    apply_setting("{501a4d13-42af-4429-9fd1-a8218c268e20}", "{ee12f906-d277-404b-b6da-e5fa1a576df5}", 0);   // ASPM

    apply_setting("{2a737441-1930-4402-8d77-b2bebba308a3}", "{48e6b7a6-50f5-4782-a5d4-53bb8f07e226}", 0);   // Selective Suspend
    apply_setting("{2a737441-1930-4402-8d77-b2bebba308a3}", "{d4e98f31-5ffe-4ce1-b57a-160e417a20c6}", 0);   // USB 3 Link Power

    apply_setting("{0012ee47-9041-4b5d-9b77-535fba8b1442}", "{6738e2c4-e8a5-4a42-b16a-e040e769756e}", 0);   // Disk Timeout
    apply_setting("{0012ee47-9041-4b5d-9b77-535fba8b1442}", "{0b2d69d7-a2a1-449c-9680-f91c70521c60}", 0);   // AHCI Link Power
    apply_setting("{0012ee47-9041-4b5d-9b77-535fba8b1442}", "{fc95af4d-40e7-4b6d-835a-56d131dbc80e}", 0);   // NVMe NOPPME

    apply_setting("{19cbb8fa-5279-450e-9fac-8a3d5fedd0c1}", "{12bbebe6-58d6-4636-95bb-3217ef867c1a}", 0);   // Wireless Adapter Mode

    apply_setting("{238c9fa8-0aad-41ed-83f4-97be242c8f20}", "{bd3b718a-0680-4d9d-8ab2-e1d2b4ac806d}", 0);   // Allow Wake Timers
    apply_setting("{238c9fa8-0aad-41ed-83f4-97be242c8f20}", "{29f6c1db-86da-48c5-9fdb-f2b67b1f44da}", 0);   // Sleep After

    apply_setting("{7516b95f-f776-4464-8c53-06167f40cc99}", "{fbd9aa66-9553-4097-ba06-ed31e62a2a1b}", 0);   // Adaptive Brightness

    apply_setting("{9596fb26-9850-41fd-ac3e-f7c3c00afd4b}", "{34c7b99f-9a6d-4b3c-8dc7-b6693b78cef4}", 1);   // Video Playback
    
    // Activate
    PowerSetActiveScheme(NULL, pNewScheme);
    
    std::string newGuidStr = GuidToString(*pNewScheme);
    LocalFree(pNewScheme);
    
    return Napi::String::New(env, newGuidStr);
}

Napi::Value DeletePowerPlan(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        return Napi::Boolean::New(env, false);
    }
    
    std::string guidStr = info[0].As<Napi::String>().Utf8Value();
    GUID planGuid;
    if (!StringToGuid(guidStr, &planGuid)) {
        return Napi::Boolean::New(env, false);
    }
    
    PowerSetActiveScheme(NULL, &MY_GUID_TYPICAL_POWER_SAVINGS);
    DWORD res = PowerDeleteScheme(NULL, &planGuid);
    
    return Napi::Boolean::New(env, res == ERROR_SUCCESS);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "emptyWorkingSetOptimization"),
                Napi::Function::New(env, EmptyWorkingSetOptimization));
    exports.Set(Napi::String::New(env, "setTimerResolution"),
                Napi::Function::New(env, SetTimerResolution));
    exports.Set(Napi::String::New(env, "globalMemoryClean"),
                Napi::Function::New(env, GlobalMemoryClean));
    exports.Set(Napi::String::New(env, "setProcessPriority"),
                Napi::Function::New(env, SetProcessPriority));
    exports.Set(Napi::String::New(env, "writeRegistry"),
                Napi::Function::New(env, WriteRegistry));
    exports.Set(Napi::String::New(env, "deleteRegistry"),
                Napi::Function::New(env, DeleteRegistry));
    exports.Set(Napi::String::New(env, "setServiceState"),
                Napi::Function::New(env, SetServiceState));
    exports.Set(Napi::String::New(env, "createPowerPlan"),
                Napi::Function::New(env, CreatePowerPlan));
    exports.Set(Napi::String::New(env, "deletePowerPlan"),
                Napi::Function::New(env, DeletePowerPlan));
    return exports;
}

NODE_API_MODULE(luperNative, Init)
