import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../lib/utils";

const Select = React.forwardRef(({ value, onValueChange, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const contextValue = {
    value: selectedValue,
    onValueChange: (newValue) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
    },
    isOpen,
    setIsOpen,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" ref={ref} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
});
Select.displayName = "Select";

const SelectContext = React.createContext({});

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSelectContext();

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md bg-transparent px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>span]:line-clamp-1",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      <span className="block truncate">{children}</span>
      <ChevronDown className={cn(
        "h-4 w-4 opacity-50 transition-transform duration-200",
        isOpen && "transform rotate-180"
      )} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ placeholder, className, ...props }, ref) => {
  const { value } = useSelectContext();
  const [displayValue, setDisplayValue] = React.useState(placeholder || "");

  React.useEffect(() => {
    if (!value) {
      setDisplayValue(placeholder || "");
    }
  }, [value, placeholder]);

  return (
    <span ref={ref} className={cn("block truncate", className)} {...props}>
      {displayValue}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSelectContext();
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      <div
        ref={ref}
        className="max-h-[300px] overflow-y-auto p-1"
        role="listbox"
      >
        {children}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = useSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "transition-colors duration-150",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => {
        onValueChange(value);
        // También actualizamos el SelectValue
        const selectValueElement = document.querySelector('[role="combobox"] span');
        if (selectValueElement) {
          selectValueElement.textContent = children;
        }
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1", className)}
    {...props}
  />
));
SelectGroup.displayName = "SelectGroup";

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </div>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </div>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};