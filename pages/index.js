import Loader from "@/components/Loader";
import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import avatar from "../public/assets/avatar.png";
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Home() {
  const { state } = useAuth();
  const todoInput = useRef();
  const { isLoading, authUser } = state;
  const router = useRouter();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!authUser && !isLoading) {
      // if authuser dont exist then navigate to login page
      router.push("/login");
    }
    if (authUser?.uid) {
      fetchTodos(authUser?.uid);
    }
  }, [authUser, isLoading]);

  const FormClear = () => {
    todoInput.current.value = "";
  };

  const addTodo = async (e) => {
    e.preventDefault();
    let todoContent = todoInput?.current?.value;
    try {
      // clear the input
      FormClear();
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "todos"), {
        owner: authUser?.uid,
        completed: false,
        content: todoContent,
      });
      fetchTodos(authUser?.uid);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodos = async (todoId) => {
    try {
      await deleteDoc(doc(db, "todos", todoId));
      fetchTodos(authUser?.uid);
    } catch (error) {
      console.log(error);
    }
  };
  const updateTodo = async (todoId, isChecked) => {
    try {
      // update the todo
      await updateDoc(doc(db, "todos", todoId), {
        completed: isChecked,
      });

      fetchTodos(authUser?.uid);
    } catch (error) {
      console.log(error);
    }
  };

  const getFirstName = () => {
    const firstName = authUser?.displayName.split(" ")[0];
    return firstName;
  };

  return authUser ? (
    <main className="">
      <div className="flex items-center justify-between py-4 px-4 sm:px-10 fixed w-full top-0 left-0 bg-white z-10">
        <h2 className="text-lg md:text-2xl font-bold">Todo app</h2>
        <div className="flex gap-2.5 items-center">
          <Image
            className="rounded-full "
            width={40}
            height={40}
            src={authUser?.photoURL ? authUser?.photoURL : avatar}
            alt="User"
          />
          <div className="font-medium">{authUser?.displayName}</div>
        </div>
      </div>

      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={() => signOut(auth)}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>

      <a
        href="https://www.facebook.com/naimurhera"
        target="_blank"
        className="bg-black text-white w-10 h-10  py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 left-5 cursor-pointer"
      >
        <BsFacebook size={18} />
      </a>

      <div className="max-w-3xl mx-auto mt-14 p-8">
        <div className="bg-white -m-6 p-3 sticky top-16">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">ToooDooo's</h1>
          </div>
          <form onSubmit={addTodo} className="flex items-center gap-2 mt-10">
            <input
              required
              ref={todoInput}
              placeholder={`👋 Hello ${getFirstName()}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
            />
            <button
              type="submit"
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </form>
        </div>

        <div className="my-10 mb-16">
          {todos.length > 0 &&
            todos?.map((todo, index) => (
              <div key={index} className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <input
                    checked={todo?.completed}
                    onChange={() => updateTodo(todo?.id, !todo?.completed)}
                    id={`todo-${index}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                  />
                  <label htmlFor={`todo-${index}`} className={`font-medium ${todo?.completed ? "line-through" : ""}`}>
                    {todo?.content}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <MdDeleteForever
                    onClick={() => deleteTodos(todo?.id)}
                    size={24}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          {todos.length == 0 && <div className="text-center w-full">No todos to show!</div>}
        </div>
      </div>
    </main>
  ) : (
    <Loader />
  );
}
