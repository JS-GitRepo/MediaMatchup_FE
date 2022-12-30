import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { auth, googleAuthProvider } from "../firebaseConfig";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import "./styles/SignIn.css";
import { onAuthStateChanged } from "firebase/auth";
import SocialContext from "../context/SocialContext";
import { getUserByHandle, updateUserByID } from "../services/UserService";
import { profanityCheck } from "../functions/utilityFunctions";
import { updateAllMatchupsByUID } from "../services/MatchupService";

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
  const [handle, setHandle] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const { userAuth, userAccount, setUserAccount } = useContext(SocialContext);
  const bgImgURL =
    "https://apollo.imgix.net/content/uploads/2018/02/LEADPablo-Picasso-Femme-au-beret-et-a-la-robe-quadrillee-Marie-Therese-Walter-December-1937.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&w=900&h=600";

  const firebaseUIConfig = {
    signInFlow: "popup",
    signInOptions: [googleAuthProvider.providerId],
  };

  const submissionHandler = async (e: FormEvent) => {
    e.preventDefault();
    const foundUser = await getUserByHandle(handle);
    if (profanityCheck(handle)) {
      setStatusMsg("Try removing profanity!");
    } else if (!foundUser || foundUser?.handle?.length! < 1) {
      let updatedHandle = {
        handle: handle.toLowerCase(),
      };
      updateUserByID(userAccount!.uid as string, updatedHandle);
      updateAllMatchupsByUID(userAccount!.uid as string, updatedHandle);
      setStatusMsg("Handle created!");
      setUserAccount({ ...updatedHandle });
    } else {
      setStatusMsg("Sorry, that handle is already taken!");
    }
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
        {auth.currentUser ? (
          <form className={"handle-form"} onSubmit={submissionHandler}>
            <h2>{`Hello ${userAuth?.displayName?.split(" ", 1)}!`}</h2>
            <div className='handle-ctr'>
              <label className='handle-label' htmlFor='handle'>
                Create Your Handle:
              </label>
              <input
                title='Handle must be 3-15 characters, containing only letters and numbers.'
                className='handle-input'
                type='text'
                name='handle'
                id='handle'
                placeholder='myhandle64'
                minLength={3}
                maxLength={15}
                pattern={"[A-Za-z0-9]+"}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />{" "}
              <button>Submit</button>
              <p className='status-msg'>{statusMsg}</p>
            </div>
          </form>
        ) : (
          <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
        )}
      </div>
    </div>
  );
};

export default SignIn;
