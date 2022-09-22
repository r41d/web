import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button.js";
import { useAppStore } from "@core/stores/appStore.js";
import { useDeviceStore } from "@core/stores/deviceStore.js";
import { subscribeAll } from "@core/subscriptions.js";
import { randId } from "@core/utils/randId.js";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ISerialConnection } from "@meshtastic/meshtasticjs";

interface USBID {
  id: number;
  name: string;
}

export const Serial = (): JSX.Element => {
  const [serialPorts, setSerialPorts] = useState<SerialPort[]>([]);
  const { addDevice } = useDeviceStore();
  const { setSelectedDevice } = useAppStore();

  const updateSerialPortList = useCallback(async () => {
    setSerialPorts(await navigator.serial.getPorts());
  }, []);

  navigator.serial.addEventListener("connect", () => {
    void updateSerialPortList();
  });
  navigator.serial.addEventListener("disconnect", () => {
    void updateSerialPortList();
  });
  useEffect(() => {
    void updateSerialPortList();
  }, [updateSerialPortList]);

  const onConnect = async (port: SerialPort) => {
    const id = randId();
    const device = addDevice(id);
    setSelectedDevice(id);
    const connection = new ISerialConnection(id);
    await connection.connect({
      port,
    });
    device.addConnection(connection);
    subscribeAll(device, connection);
  };

  return (
    <div className="flex flex-col p-4 gap-2 w-full">
      <div className="flex gap-2 flex-col h-48 overflow-y-auto">
        {serialPorts.map((port, index) => (
          <Button
            key={index}
            variant="secondary"
            onClick={() => {
              void onConnect(port);
            }}
          >
            {port.getInfo().usbVendorId} - {port.getInfo().usbProductId}
          </Button>
        ))}
      </div>
      <Button
        iconBefore={<PlusCircleIcon className="w-4" />}
        onClick={() => {
          void navigator.serial.requestPort().then((port) => {
            setSerialPorts(serialPorts.concat(port));
          });
        }}
      >
        New device
      </Button>
    </div>
  );
};