var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let callbackName = (0, import_isbot.default)(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 24,
        columnNumber: 7
      }, this),
      {
        [callbackName]: () => {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-KGTXEAZO.css";

// app/utils/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/utils/db.server.ts
var import_client = require("@prisma/client"), prisma;
global.__db__ || (global.__db__ = new import_client.PrismaClient()), prisma = global.__db__, prisma.$connect();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: !0
    }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(
    password,
    userWithPassword.password.hash
  ))
    return null;
  let { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// app/utils/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), links = () => [{ rel: "stylesheet", href: tailwind_default }], meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  return (0, import_node3.json)({
    user: await getUser(request)
  });
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    className: "h-full",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 36,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 34,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        className: "h-full",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 39,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 42,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader2
});
async function loader2({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action,
  loader: () => loader3
});
var import_node4 = require("@remix-run/node");
async function action({ request }) {
  return logout(request);
}
async function loader3() {
  return (0, import_node4.redirect)("/");
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react5 = require("@remix-run/react");

// app/utils.ts
var import_react3 = require("@remix-run/react"), import_react4 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function useMatchesData(id) {
  let matchingRoutes = (0, import_react3.useMatches)(), route = (0, import_react4.useMemo)(
    () => matchingRoutes.find((route2) => route2.id === id),
    [matchingRoutes, id]
  );
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object" && typeof user.email == "string";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/index.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Index() {
  let user = useOptionalUser();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
    className: "relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "relative sm:pb-16 sm:pt-8",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "mx-auto max-w-7xl sm:px-6 lg:px-8",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "relative shadow-xl sm:overflow-hidden sm:rounded-2xl",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "absolute inset-0",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                    className: "h-full w-full object-cover",
                    src: "https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg",
                    alt: "Sonic Youth On Stage"
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 13,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply"
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 18,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/index.tsx",
                lineNumber: 12,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
                    className: "text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                      className: "block uppercase text-yellow-500 drop-shadow-md",
                      children: "Indie Stack"
                    }, void 0, !1, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 22,
                      columnNumber: 17
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 21,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
                    className: "mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl",
                    children: "Check the README.md file for instructions on how to get this project deployed."
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 26,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center",
                    children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
                      to: "/notes",
                      className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8",
                      children: [
                        "View Notes for ",
                        user.email
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 32,
                      columnNumber: 19
                    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                      className: "space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
                          to: "/join",
                          className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8",
                          children: "Sign up"
                        }, void 0, !1, {
                          fileName: "app/routes/index.tsx",
                          lineNumber: 40,
                          columnNumber: 21
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
                          to: "/login",
                          className: "flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600",
                          children: "Log In"
                        }, void 0, !1, {
                          fileName: "app/routes/index.tsx",
                          lineNumber: 46,
                          columnNumber: 21
                        }, this)
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 39,
                      columnNumber: 19
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 30,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
                    href: "https://remix.run",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                      src: "https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg",
                      alt: "Remix",
                      className: "mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                    }, void 0, !1, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 56,
                      columnNumber: 17
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 55,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/index.tsx",
                lineNumber: 20,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/index.tsx",
            lineNumber: 11,
            columnNumber: 11
          }, this)
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 10,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "mt-6 flex flex-wrap justify-center gap-8",
            children: [
              {
                src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
                alt: "Fly.io",
                href: "https://fly.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
                alt: "SQLite",
                href: "https://sqlite.org"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
                alt: "Prisma",
                href: "https://prisma.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                alt: "Tailwind",
                href: "https://tailwindcss.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
                alt: "MSW",
                href: "https://mswjs.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
                alt: "Vitest",
                href: "https://vitest.dev"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org"
              }
            ].map((img) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
              href: img.href,
              className: "flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                alt: img.alt,
                src: img.src,
                className: "object-contain"
              }, void 0, !1, {
                fileName: "app/routes/index.tsx",
                lineNumber: 130,
                columnNumber: 17
              }, this)
            }, img.href, !1, {
              fileName: "app/routes/index.tsx",
              lineNumber: 125,
              columnNumber: 15
            }, this))
          }, void 0, !1, {
            fileName: "app/routes/index.tsx",
            lineNumber: 67,
            columnNumber: 11
          }, this)
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 66,
          columnNumber: 9
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/routes/index.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/index.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => LoginPage,
  loader: () => loader4,
  meta: () => meta2
});
var import_node5 = require("@remix-run/node"), import_react6 = require("@remix-run/react"), React = __toESM(require("react"));
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader4({ request }) {
  return await getUserId(request) ? (0, import_node5.redirect)("/") : (0, import_node5.json)({});
}
async function action2({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/notes"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node5.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node5.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node5.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo
  }) : (0, import_node5.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}
var meta2 = () => ({
  title: "Login"
});
function LoginPage() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react6.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", actionData = (0, import_react6.useActionData)(), emailRef = React.useRef(null), passwordRef = React.useRef(null);
  return React.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react6.Form, {
        method: "post",
        className: "space-y-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "email",
                className: "block text-sm font-medium text-gray-700",
                children: "Email address"
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 87,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    ref: emailRef,
                    id: "email",
                    required: !0,
                    autoFocus: !0,
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                    "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
                    "aria-describedby": "email-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 94,
                    columnNumber: 15
                  }, this),
                  ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "email-error",
                    children: actionData.errors.email
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 107,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 93,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 86,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "password",
                className: "block text-sm font-medium text-gray-700",
                children: "Password"
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 115,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "password",
                    ref: passwordRef,
                    name: "password",
                    type: "password",
                    autoComplete: "current-password",
                    "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
                    "aria-describedby": "password-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 122,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: actionData.errors.password
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 133,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 121,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 114,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 140,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            type: "submit",
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            children: "Log in"
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 141,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-between",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "flex items-center",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "remember",
                    name: "remember",
                    type: "checkbox",
                    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 149,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "remember",
                    className: "ml-2 block text-sm text-gray-900",
                    children: "Remember me"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 155,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 148,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "text-center text-sm text-gray-500",
                children: [
                  "Don't have an account?",
                  " ",
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react6.Link, {
                    className: "text-blue-500 underline",
                    to: {
                      pathname: "/join",
                      search: searchParams.toString()
                    },
                    children: "Sign up"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 164,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 162,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 147,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 85,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 83,
    columnNumber: 5
  }, this);
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action3,
  default: () => Join,
  loader: () => loader5,
  meta: () => meta3
});
var import_node6 = require("@remix-run/node"), import_react7 = require("@remix-run/react"), React2 = __toESM(require("react"));
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader5({ request }) {
  return await getUserId(request) ? (0, import_node6.redirect)("/") : (0, import_node6.json)({});
}
async function action3({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node6.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node6.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node6.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  if (await getUserByEmail(email))
    return (0, import_node6.json)(
      {
        errors: {
          email: "A user already exists with this email",
          password: null
        }
      },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo
  });
}
var meta3 = () => ({
  title: "Sign Up"
});
function Join() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react7.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react7.useActionData)(), emailRef = React2.useRef(null), passwordRef = React2.useRef(null);
  return React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Form, {
        method: "post",
        className: "space-y-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "email",
                className: "block text-sm font-medium text-gray-700",
                children: "Email address"
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 93,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    ref: emailRef,
                    id: "email",
                    required: !0,
                    autoFocus: !0,
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                    "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
                    "aria-describedby": "email-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 100,
                    columnNumber: 15
                  }, this),
                  ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "email-error",
                    children: actionData.errors.email
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 99,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 92,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "password",
                className: "block text-sm font-medium text-gray-700",
                children: "Password"
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 121,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "password",
                    ref: passwordRef,
                    name: "password",
                    type: "password",
                    autoComplete: "new-password",
                    "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
                    "aria-describedby": "password-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 128,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: actionData.errors.password
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 127,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 120,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 146,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            type: "submit",
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            children: "Create Account"
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 147,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-center",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "text-center text-sm text-gray-500",
              children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Link, {
                  className: "text-blue-500 underline",
                  to: {
                    pathname: "/login",
                    search: searchParams.toString()
                  },
                  children: "Log in"
                }, void 0, !1, {
                  fileName: "app/routes/join.tsx",
                  lineNumber: 156,
                  columnNumber: 15
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/join.tsx",
              lineNumber: 154,
              columnNumber: 13
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 153,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/join.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/join.tsx",
      lineNumber: 90,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/join.tsx",
    lineNumber: 89,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "bb14ff15", entry: { module: "/build/entry.client-RKESCNHM.js", imports: ["/build/_shared/chunk-WJFKS4HK.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-PLNJVTQA.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-QB3PEZAZ.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-SYMFOSV2.js", imports: ["/build/_shared/chunk-T3SEI7F3.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-TTTZJAPG.js", imports: ["/build/_shared/chunk-LM47TFZL.js", "/build/_shared/chunk-T3SEI7F3.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-52CIUJEK.js", imports: ["/build/_shared/chunk-LM47TFZL.js", "/build/_shared/chunk-T3SEI7F3.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-DOMDNNGV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-BB14FF15.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
