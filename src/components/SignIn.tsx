import { useEffect, useRef, useState } from "react";
import { auth, googleAuthProvider } from "../firebaseConfig";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import "./styles/SignIn.css";
import { onAuthStateChanged } from "firebase/auth";

interface SFA_Props {
  uiConfig: firebaseui.auth.Config;
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  firebaseAuth: any;
  className?: string;
}

// This is required because firebaseui-react is not supported. This emulates what would fix that app for React 18
const StyledFirebaseAuth = ({
  uiConfig,
  uiCallback,
  firebaseAuth,
  className,
}: SFA_Props) => {
  const [userSignedIn, setUserSignedIn] = useState<boolean>(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Get or Create a firebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) firebaseUiWidget.reset();
      setUserSignedIn(!!user);
    });

    // Trigger the callback if any was set.
    if (uiCallback) uiCallback(firebaseUiWidget);

    // Render the firebaseUi Widget.
    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseui, uiConfig]);

  return <div className={className} ref={elementRef} />;
};

const SignIn = () => {
  const bgImgURL =
    "https://apollo.imgix.net/content/uploads/2018/02/LEADPablo-Picasso-Femme-au-beret-et-a-la-robe-quadrillee-Marie-Therese-Walter-December-1937.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&w=900&h=600";

  const firebaseUIConfig = {
    signInFlow: "popup",
    signInOptions: [googleAuthProvider.providerId],
  };

  return (
    <div className='SignIn full-h-w'>
      <img
        className='sign-in-bg-img full-h-w'
        src={bgImgURL}
        alt='login background image'
      />
      <div className='content-ctr'>
        <h1>MediaMatchup</h1>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </div>
    </div>
  );
};

export default SignIn;
