import { Authenticated, Refine, GitHubBanner,} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";

import { CssBaseline, GlobalStyles } from "@mui/material";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import { dataProvider } from "./provider";
import authProvider from "./authProvider";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
                authProvider={authProvider}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              dataProvider={dataProvider("https://backoffice-backoffice-api.sit.edupluz.io/api")}
              resources={[
                {
                  name: "courses",
                  list: "/courses",
                  show: "/blog-posts/show/:id",
                  create: "/blog-posts/create",
                  edit: "/courses/:id",
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                    path="/login"
                    element={<AuthPage type="login" />}
                />
                <Route
                    element={
                      <Authenticated
                          fallback={
                            <CatchAllNavigate to="/login" />
                          }
                      >
                        <ThemedLayoutV2>
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                >
                  <Route
                      index
                      element={
                        <NavigateToResource resource="courses" />
                      }
                  />
                  <Route path="courses">
                    <Route index element={<MuiInferencer />} />

                    <Route
                        path="show/:id"
                        element={<MuiInferencer />}
                    />
                    <Route
                        path=":id"
                        element={<MuiInferencer />}
                    />
                    <Route
                        path="create"
                        element={<MuiInferencer />}
                    />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
