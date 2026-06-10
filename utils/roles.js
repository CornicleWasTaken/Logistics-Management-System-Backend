export const ROLES = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  WAREHOUSE_STAFF: "warehouse_staff",
  DRIVER: "driver",
  CUSTOMER: "customer",
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

const ROLE_ALIASES = new Map([
  ["admin", ROLES.ADMIN],
  ["manager", ROLES.MANAGER],
  ["warehouse_staff", ROLES.WAREHOUSE_STAFF],
  ["warehouse-staff", ROLES.WAREHOUSE_STAFF],
  ["warehouse staff", ROLES.WAREHOUSE_STAFF],
  ["warehousestaff", ROLES.WAREHOUSE_STAFF],
  ["staff", ROLES.WAREHOUSE_STAFF],
  ["driver", ROLES.DRIVER],
  ["customer", ROLES.CUSTOMER],
]);

export const PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF, ROLES.DRIVER],
  CREATE_OR_EDIT_ORDERS: [ROLES.ADMIN, ROLES.MANAGER],
  PLACE_CUSTOMER_ORDER: [ROLES.CUSTOMER, ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_INVENTORY: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF],
  CREATE_SHIPMENTS: [ROLES.ADMIN, ROLES.MANAGER],
  READ_SHIPMENTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF, ROLES.DRIVER, ROLES.CUSTOMER],
  UPDATE_SHIPMENT_STATUS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF, ROLES.DRIVER],
  VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_USERS: [ROLES.ADMIN],
});

export function normalizeRole(role) {
  if (!role || typeof role !== "string") {
    return undefined;
  }

  return ROLE_ALIASES.get(role.trim().toLowerCase());
}

export function isValidRole(role) {
  return ROLE_VALUES.includes(normalizeRole(role));
}