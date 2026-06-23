SYSTEM_ADMIN = "SYSTEM_ADMIN"
ADMIN = "ADMIN"
DEVELOPER = "DEVELOPER"
USER = "USER"

ROLE_DEFINITIONS = {
    SYSTEM_ADMIN: ("\u7cfb\u7edf\u7ba1\u7406\u5458", "System-wide administrator"),
    ADMIN: ("\u7ba1\u7406\u5458", "Enterprise business and member administrator"),
    DEVELOPER: ("\u5f00\u53d1\u8005", "Capability developer"),
    USER: ("\u4f7f\u7528\u8005", "Platform user"),
}

PERMISSION_DEFINITIONS = {
    "page.home": ("Home", "Access home"),
    "page.marketplace": ("Marketplace", "Access capability marketplace"),
    "page.developer": ("Developer center", "Access developer center"),
    "page.guide": ("Developer guide", "Access developer guide"),
    "page.audit": ("Release audit", "Access release audit"),
    "page.members": ("Member management", "Access member management"),
    "members.read": ("Read members", "View member list and details"),
    "members.create": ("Create members", "Add enterprise members"),
    "members.update": ("Update members", "Edit member profiles"),
    "members.role": ("Change member roles", "Change a member role"),
    "members.reset_password": ("Reset member passwords", "Reset a member password"),
    "members.status": ("Change member status", "Enable or disable members"),
    "members.delete": ("Remove members", "Soft-delete enterprise members"),
}

ROLE_PERMISSION_CODES = {
    ADMIN: set(PERMISSION_DEFINITIONS),
    DEVELOPER: {"page.home", "page.marketplace", "page.developer", "page.guide"},
    USER: {"page.home", "page.marketplace", "page.guide"},
}