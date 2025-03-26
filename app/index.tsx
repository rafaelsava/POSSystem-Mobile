import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Simular un tiempo de carga de 2s y luego ir a la pantalla de Welcome
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}