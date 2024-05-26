import { Suspense } from "react"
import { CharacterTonyHawk } from "../3dObjects/Characters/TonyHawk"

export const CharacterController = () => 
    {
        //Gestion des events ici

        return(
                <>
                <Suspense fallback={null}>
                    <CharacterTonyHawk boardVisibility={true}/>
                </Suspense>
                </>
                )
    }