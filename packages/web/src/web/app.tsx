import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Index from "./pages/index";
import SignInPage from "./pages/sign-in";
import DashboardPage from "./pages/dashboard";
import CoursesPage from "./pages/courses";
import CoursePage from "./pages/course";
import WhatsNewPage from "./pages/whats-new";
import TermsPage from "./pages/terms";
import ReportPage from "./pages/report";
import ContactPage from "./pages/contact";
import { Provider } from "./components/provider";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { ProtectedRoute } from "./components/protected-route";
import { BrandLink } from "./components/ui/brand-button";
import { Shell } from "./components/ui/primitives";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function ScrollTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function NotFound() {
  return (
    <Shell className="py-28 text-center">
      <p className="display text-[90px] leading-none text-navy">404</p>
      <h1 className="mt-4 text-2xl uppercase">Page not found</h1>
      <BrandLink to="/" variant="navy" className="mt-7">
        Back home
      </BrandLink>
    </Shell>
  );
}

function App() {
  return (
    <Provider>
      <ScrollTop />
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/dashboard">
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </Route>
            <Route path="/courses" component={CoursesPage} />
            <Route path="/courses/:slug" component={CoursePage} />
            <Route path="/whats-new" component={WhatsNewPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/report" component={ReportPage} />
            <Route path="/contact" component={ContactPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <SiteFooter />
      </div>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
