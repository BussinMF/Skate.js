import { useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useState } from "react";
import { CharacterTonyHawk } from "../3dObjects/Characters/TonyHawk";

export const CharacterController = () => 
    {
        //load animations here
        const { animations: idle_1 } = useGLTF('./character/animations/idle_1.glb');
        //const { animations: idle_2 } = useGLTF('./character/animations/idle_1.glb');
        //const { animations: idle_3 } = useGLTF('./character/animations/idle_1.glb');

        const [animObject, setAnimObject] = useState({})

        //Gestion des events ici sur un state
        const events = {
            idle_1: true, //switch here to false to stop animation idle
            idle_2:false,
            //idle_3:
            }


        useEffect(() => {
            if (idle_1) { setAnimObject((prev) => ({ ...prev, idle_1 })); }
          }, [idle_1]);

        return(
                <>
                <Suspense fallback={null}>
                    <CharacterTonyHawk boardVisibility={true} animationsObject={animObject} events={events}/>
                </Suspense>
                </>
                )
    }

useGLTF.preload('./character/animations/idle_1.glb');
