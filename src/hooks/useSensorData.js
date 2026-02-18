import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

export const useSensorData = (deviceId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    setLoading(true);

    // devices/MAC_ADDR/readings
    const query = firestore()
      .collection("devices")
      .doc(deviceId)
      .collection("readings")
      .orderBy("created_at", "desc")
      .limit(20);

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const readings = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            millisiemenspermeter: Math.round(d.millisiemenspermeter),
            ph: Math.round(d.pH),
            ppm: Math.round(d.ppm),
            temp: Math.round(d.temp),
            timestamp: d.created_at ? d.created_at.toDate() : new Date(),
          };
        });
        setData(readings.reverse());
        setLoading(false);
      },
      (error) => {
        console.error("Sensor Data Listener Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [deviceId]);

  return { data, loading };
};
