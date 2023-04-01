import { useEffect } from "react";
import { history } from 'umi';

export default function LoginPage() {
  useEffect(() => {

    setTimeout(() => {
      history.push('/home');
    }, 100);

  }, []);
  return (
    <div>
      <h2>LoginPage! Welcome to umi!</h2>
      <p>
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </div>
  );
}
