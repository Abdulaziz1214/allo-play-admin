export const navItems = [
  {
    sectionKey: "overview",
    items: [
      {
        labelKey: "dashboard",
        to: "/dashboard",
        permission: null,
      },
    ],
  },
  {
    sectionKey: "content",
    items: [
      {
        labelKey: "movies",
        to: "/movies",
        permission: "movies.view",
      },
      {
        labelKey: "series",
        to: "/series",
        permission: "series.view",
      },
      {
        labelKey: "reels",
        to: "/reels",
        permission: "reels.view",
      },
      {
        labelKey: "tvChannels",
        to: "/tv-channels",
        permission: "tv_channels.view",
      },
      {
        labelKey: "categories",
        to: "/categories",
        permission: null,
      },
    ],
  },
  {
    sectionKey: "users",
    items: [
      {
        labelKey: "users",
        to: "/users",
        permission: "users.view",
      },
      {
        labelKey: "subscriptions",
        to: "/subscriptions",
        permission: "subscriptions.view",
      },
    ],
  },
  {
    sectionKey: "finance",
    items: [
      {
        labelKey: "payments",
        to: "/payments",
        permission: "payments.view",
      },
    ],
  },
  {
    sectionKey: "system",
    items: [
      {
        labelKey: "admins",
        to: "/admins",
        permission: "admins.view",
      },
      {
        labelKey: "roles",
        to: "/roles",
        permission: "roles.view",
      },
      {
        labelKey: "permissions",
        to: "/permissions",
        permission: "permissions.view",
      },
      {
        labelKey: "settings",
        to: "/settings",
        permission: "settings.view",
      },
    ],
  },
];
