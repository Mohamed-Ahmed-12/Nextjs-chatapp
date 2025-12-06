import { useEffect, useState } from "react";
import { fetchLanguages } from "../lib/apis";
import toast from "react-hot-toast";

export default function useLanguage() {
    const [langs, setLangs] = useState([]);
    useEffect(() => {
        fetchLanguages()
            .then((data) => {
                setLangs(data)
            })
            .catch((err) => {
                toast.error(err?.message ?? "Error while fetching languages")
            })
    }, [])
    return langs
}