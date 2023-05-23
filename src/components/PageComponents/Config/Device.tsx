import type { ConfigPreset } from "@app/core/stores/appStore";
import type { DeviceValidation } from "@app/validation/config/device.js";
import { DynamicForm, EnableSwitchData } from "@components/Form/DynamicForm.js";
import { useConfig, useDevice } from "@core/stores/deviceStore.js";
import { Protobuf } from "@meshtastic/meshtasticjs";

export const Device = (): JSX.Element => {
  const config = useConfig();
  const enableSwitch: EnableSwitchData | undefined = config.overrideValues
    ? {
        getEnabled(name) {
          return config.overrideValues![name] ?? false;
        },
        setEnabled(name, value) {
          config.overrideValues![name] = value;
        }
      }
    : undefined;
  const isPresetConfig = !("id" in config);
  const { setWorkingConfig } = !isPresetConfig
    ? useDevice()
    : { setWorkingConfig: undefined };
  const setConfig: (data: DeviceValidation) => void = isPresetConfig
    ? (data) => {
        config.config.device = new Protobuf.Config_DeviceConfig(data);
        (config as ConfigPreset).saveConfigTree();
      }
    : (data) => {
        setWorkingConfig!(
          new Protobuf.Config({
            payloadVariant: {
              case: "device",
              value: data
            }
          })
        );
      };

  const onSubmit = setConfig;

  return (
    <DynamicForm<DeviceValidation>
      onSubmit={onSubmit}
      defaultValues={config.config.device}
      enableSwitch={enableSwitch}
      fieldGroups={[
        {
          label: "Device Settings",
          description: "Settings for the device",
          fields: [
            {
              type: "select",
              name: "role",
              label: "Role",
              description: "What role the device performs on the mesh",
              properties: {
                enumValue: Protobuf.Config_DeviceConfig_Role,
                formatEnumName: true
              }
            },
            {
              type: "toggle",
              name: "serialEnabled",
              label: "Serial Output Enabled",
              description: "Enable the device's serial console"
            },
            {
              type: "toggle",
              name: "debugLogEnabled",
              label: "Enabled Debug Log",
              description:
                "Output debugging information to the device's serial port (auto disables when serial client is connected)"
            },
            {
              type: "number",
              name: "buttonGpio",
              label: "Button Pin",
              description: "Button pin override"
            },
            {
              type: "number",
              name: "buzzerGpio",
              label: "Buzzer Pin",
              description: "Buzzer pin override"
            },
            {
              type: "select",
              name: "rebroadcastMode",
              label: "Rebroadcast Mode",
              description: "How to handle rebroadcasting",
              properties: {
                enumValue: Protobuf.Config_DeviceConfig_RebroadcastMode,
                formatEnumName: true
              }
            },
            {
              type: "number",
              name: "nodeInfoBroadcastSecs",
              label: "Node Info Broadcast Interval",
              description: "How often to broadcast node info",
              properties: {
                suffix: "Seconds"
              }
            },
            {
              type: "toggle",
              name: "doubleTapAsButtonPress",
              label: "Double Tap as Button Press",
              description:
                "Require a double tap of the button to send a button press"
            },
            {
              type: "toggle",
              name: "isManaged",
              label: "Managed",
              description: "Is this device managed by an external application"
            }
          ]
        }
      ]}
    />
  );
};
