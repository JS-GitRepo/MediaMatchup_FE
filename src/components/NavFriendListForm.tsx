import "./styles/NavFriendListForm.css";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import SocialContext from "../context/SocialContext";
import Friend from "../models/Friend";
import {
  addFriend,
  getUserByEmail,
  getUserById,
} from "../services/UserService";
import { signInWithGoogle } from "../firebaseConfig";
import { Link } from "react-router-dom";

const NavFriendListForm = () => {
  const [friendEmail, setFriendEmail] = useState<string>();
  const [friendStatusMsg, setFriendStatusMsg] = useState<string>("");
  const [statusIsGreen, setStatusIsGreen] = useState<boolean>(true);
  const [friends, setFriends] = useState<any[]>([]);
  const { user } = useContext(SocialContext);
  const formRef = useRef<HTMLFormElement>(null);
  const statusMsgTimeout = 5000;

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const friend = await getUserByEmail(friendEmail!);
    const currentUser = await getUserById(user?.uid!);
    if (friend) {
      if (currentUser?.friends) {
        const isAlreadyFriend = currentUser?.friends!.find(
          (item) => item.uid === friend.uid
        );
        if (isAlreadyFriend) {
          setStatusIsGreen(true);
          setFriendStatusMsg(`${friend.name} is already your friend!`);
          setTimeout(() => setFriendStatusMsg(""), statusMsgTimeout);
        } else {
          let friendObj = {
            uid: friend.uid,
            name: friend.name,
          };
          await addFriend(user?.uid!, friendObj);
          setStatusIsGreen(true);
          setFriendStatusMsg(
            `${friend.email} has been added to your friends list!`
          );
          setTimeout(() => setFriendStatusMsg(""), statusMsgTimeout);
          setFriends(currentUser?.friends);
        }
      }
    } else {
      setStatusIsGreen(false);
      setFriendStatusMsg(
        `Sorry, no user found with the email '${friendEmail}'`
      );
      setTimeout(() => setFriendStatusMsg(""), statusMsgTimeout);
    }
    formRef.current?.reset();
  };

  useEffect(() => {
    if (user) {
      getUserById(user!.uid!).then((response) => {
        setFriends(response!.friends!);
      });
    }
  }, [user, friendStatusMsg]);

  return (
    <div className='NavFriendListForm'>
      {user ? (
        <div>
          <form
            ref={formRef}
            className='add-friend-form'
            onSubmit={(e) => submitHandler(e)}>
            <label htmlFor='addFriend'></label>
            <input
              type='email'
              name='addFriend'
              id='addFriend'
              placeholder='yourfriend@email.com'
              required
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button>Add Friend</button>
          </form>

          <p
            className={`add-friend-status ${
              statusIsGreen ? "is-green" : "is-red"
            }`}>
            {friendStatusMsg}
          </p>

          <div className='nav-friends-list'>
            <h2>Your Friends</h2>
            <ul>
              {friends.map((friend, i) => {
                return (
                  <Link key={i} to={`/nav/friends/${friend.uid}`}>
                    <p>{friend.name}</p>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={signInWithGoogle}>
            Sign in to See Your Friends!
          </button>
        </div>
      )}
    </div>
  );
};

export default NavFriendListForm;
