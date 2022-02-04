import React, {useState, useEffect, createContext} from 'react';
import auth from '@react-native-firebase/auth';

export const LoginContext = createContext({});

const LoginProvider = props => {
  const [korisnik, setKorisnik] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthStateChanged = user => {
    setKorisnik(user);
    setIsLoading(false);
  };

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return subscribe;
  }, []);

  return (
    <LoginContext.Provider value={{korisnik, isLoading}}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
