import type { LucideIcon } from "lucide-react";
import { Button } from "./Button.js";
import { Input } from "./Input.js";

export interface ConfigSelectButtonProps {
  label: string;
  active?: boolean;
  value: number;
  setValue: (val: number) => void;
  editing: boolean;
  onClick?: () => void;
  onChangeDone?: (value: string) => void;
  disabled: boolean;
}

export const ConfigSelectButton = ({
  label,
  active,
  value,
  setValue,
  editing,
  onClick,
  onChangeDone,
  disabled
}: ConfigSelectButtonProps): JSX.Element => (
  <Button
    onClick={onClick}
    variant={active ? "subtle" : "ghost"}
    size="sm"
    className="w-full justify-between gap-2 my-[2px]"
  >
    {editing ? 
    <Input
        autoFocus
        onFocus={(event) => event.target.select()}
        id="configRename"
        onBlur={(event) => {onChangeDone && onChangeDone(event.target.value)}}
        onKeyUp={(event) => event.key == "Enter" && event.currentTarget.blur()}
        defaultValue={label}
        className="h-8"/> : label}
    <div className="flex">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setValue(Math.max(value - 1, 0));
        }}
        variant="outline"
        className="h-[20px] p-2 m-2"
        disabled={disabled}
      >
        -
      </Button>
      <div className="my-2 w-4">{value}</div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setValue(value + 1);
        }}
        variant="outline"
        className="h-[20px] p-2  m-2"
        disabled={disabled}
      >
        +
      </Button>
    </div>
  </Button>
);
