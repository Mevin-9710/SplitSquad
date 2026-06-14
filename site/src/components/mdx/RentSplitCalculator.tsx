"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users } from "lucide-react";

interface Room {
  name: string;
  size: number;
}

export function RentSplitCalculator({
  defaultRooms = [
    { name: "Master", size: 150 },
    { name: "Room 2", size: 110 },
    { name: "Room 3", size: 80 },
  ],
  defaultRent = 45000,
  defaultCommonArea = 400,
}: {
  defaultRooms?: Room[];
  defaultRent?: number;
  defaultCommonArea?: number;
}) {
  const [rooms, setRooms] = useState(defaultRooms);
  const [rent, setRent] = useState(defaultRent);
  const [commonArea, setCommonArea] = useState(defaultCommonArea);

  const totalPrivate = rooms.reduce((sum, r) => sum + r.size, 0);
  const totalArea = totalPrivate + commonArea;
  const perSqFt = rent / totalArea;
  const commonSharePerPerson = (commonArea * perSqFt) / rooms.length;

  const shares = rooms.map((r) => {
    const privateShare = r.size * perSqFt;
    const total = privateShare + commonSharePerPerson;
    return {
      ...r,
      privateShare: Math.round(privateShare),
      commonShare: Math.round(commonSharePerPerson),
      total: Math.round(total),
      percent: ((total / rent) * 100).toFixed(1),
    };
  });

  const updateRoom = (index: number, size: number) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], size: Math.max(30, size) };
    setRooms(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Rent Split Calculator</h3>
      </div>

      <div className="mb-4">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-1">
          Total Monthly Rent: ₹{rent.toLocaleString("en-IN")}
        </label>
        <input
          type="range"
          min={10000}
          max={120000}
          step={1000}
          value={rent}
          onChange={(e) => setRent(Number(e.target.value))}
          className="w-full accent-primary-container"
        />
      </div>

      <div className="space-y-3 mb-6">
        {rooms.map((room, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase w-20 text-on-surface-variant">{room.name}</span>
            <input
              type="range"
              min={30}
              max={300}
              value={room.size}
              onChange={(e) => updateRoom(i, Number(e.target.value))}
              className="flex-1 accent-primary-container"
            />
            <span className="font-mono text-xs w-16 text-right">{room.size} sq.ft</span>
          </div>
        ))}
      </div>

      <div className="border-2 border-on-surface/20 divide-y-2 divide-on-surface/10" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
        <div className="flex items-center justify-between p-2 font-mono text-[10px] uppercase text-on-surface-variant">
          <span className="w-24">Room</span>
          <span className="w-16 text-right">Private</span>
          <span className="w-16 text-right">Common</span>
          <span className="w-20 text-right font-bold">Total</span>
        </div>
        {shares.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-2 font-body text-body-sm">
            <span className="w-24 font-headline text-xs uppercase">{s.name}</span>
            <span className="w-16 text-right text-on-surface-variant">₹{s.privateShare.toLocaleString("en-IN")}</span>
            <span className="w-16 text-right text-on-surface-variant">₹{s.commonShare.toLocaleString("en-IN")}</span>
            <span className="w-20 text-right font-bold">₹{s.total.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase text-center text-on-surface-variant mt-3">
        Common area ({commonArea} sq.ft) divided equally · {rooms.length} flatmates
      </p>
    </motion.div>
  );
}
