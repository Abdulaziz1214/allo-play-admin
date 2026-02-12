export const navItems = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        permission: null,
      },
    ],
  },


  {
    section: "Content",
    items: [
      {
        label: "Movies",
        to: "/movies",
        permission: "movies.view",
      },
      {
        label: "Series",
        to: "/series",
        permission: "series.view",
      },
      {
        label: "Reels",
        to: "/reels",
        permission: "reels.view",
      },
      {
        label: "TV Channels",
        to: "/tv-channels",
        permission: "tv_channels.view",
      },
      {
        label: "Categories",
        to: "/categories",
        // permission: "genres.view", // если такого нет — временно уберём, см. ниже
        permission: null,

      },
    ],
  },

  {
    section: "Users",
    items: [
      {
        label: "Users",
        to: "/users",
        permission: "users.view",
      },
      {
        label: "Subscriptions",
        to: "/subscriptions",
        permission: "subscriptions.view",
      },
    ],
  },

  {
    section: "Finance",
    items: [
      {
        label: "Payments",
        to: "/payments",
        permission: "payments.view",
      },
    ],
  },

  {
    section: "System",
    items: [
      {
        label: "Admins",
        to: "/admins",
        permission: "admins.view",
      },
      {
        label: "Roles",
        to: "/roles",
        permission: "roles.view",
      },
      {
        label: "Permissions",
        to: "/permissions",
        permission: "permissions.view",
      },
      {
        label: "Settings",
        to: "/settings",
        permission: "settings.view",
      },
    ],
  },
];
