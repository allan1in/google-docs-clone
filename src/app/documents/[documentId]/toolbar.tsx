"use client";

import { useEditorStore } from "@/app/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type ColorResult, SketchPicker } from "react-color";
import {
  LucideIcon,
  Undo2,
  Redo2,
  Printer,
  SpellCheck,
  Bold,
  Italic,
  Underline,
  MessageSquarePlus,
  ListTodo,
  RemoveFormatting,
  ChevronDown,
  Highlighter,
  Link2,
  ImageIcon,
  UploadIcon,
  SearchIcon,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  ListOrdered,
  List,
  Minus,
  Plus,
  ListCollapse,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Level } from "@tiptap/extension-heading";
import { useState } from "react";

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <ListCollapse className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <DropdownMenuItem asChild key={value}>
            <button
              onClick={() => editor?.chain().focus().setLineHeight(value).run()}
              className={cn(
                "hover:bg-neutral-200/80 rounded-sm flex items-center gap-x-2 px-2 py-1 w-full cursor-pointer",
                editor?.getAttributes("paragraph").lineHeight === value &&
                  "bg-neutral-200"
              )}
            >
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrement}
        className="h-7 w-7 flex items-center justify-center hover:bg-neutral-200/80 rounded-sm"
      >
        <Minus className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 rounded-sm text-sm border border-neutral-400 text-center bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="h-7 w-10 rounded-sm text-sm border border-neutral-400 text-center bg-transparent cursor-text"
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={increment}
        className="h-7 w-7 flex items-center justify-center hover:bg-neutral-200/80 rounded-sm"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: "Bullet List",
      value: "bulletList",
      icon: List,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      value: "orderedList",
      icon: ListOrdered,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  const getCurrentList = () => {
    for (const { value } of lists) {
      if (editor?.isActive(value)) {
        return value;
      }
    }
    return "bulletlist";
  };

  const CurrentIcon =
    lists.find(({ value }) => value === getCurrentList())?.icon || List;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <CurrentIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, onClick, value }) => (
          <DropdownMenuItem asChild key={label}>
            <button
              onClick={onClick}
              className={cn(
                "hover:bg-neutral-200/80 rounded-sm flex items-center gap-x-2 px-2 py-1 w-full cursor-pointer",
                editor?.isActive(value) && "bg-neutral-200"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeft,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenter,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRight,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustify,
    },
  ];

  const getCurrentAlignment = () => {
    for (const { value } of alignments) {
      if (editor?.isActive({ textAlign: value })) {
        return value;
      }
    }
    return "left";
  };

  const CurrentIcon =
    alignments.find(({ value }) => value === getCurrentAlignment())?.icon ||
    AlignLeft;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <CurrentIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem asChild key={value}>
            <button
              onClick={() => editor?.chain().focus().setTextAlign(value).run()}
              className={cn(
                "hover:bg-neutral-200/80 rounded-sm flex items-center gap-x-2 px-2 py-1 w-full cursor-pointer",
                editor?.isActive({ textAlign: value }) && "bg-neutral-200"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageURL = URL.createObjectURL(file);
        onChange(imageURL);
      }
    };

    input.click();
  };

  const handleImageURLSubmit = () => {
    if (imageURL) {
      onChange(imageURL);
      setImageURL("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={onUpload}
            className="hover:bg-neutral-200/80 cursor-pointer"
          >
            <UploadIcon className="size-4" />
            Upload
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-neutral-200/80 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <SearchIcon className="size-4" />
            Paste image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert image URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Insert image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageURLSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageURLSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();

  const [value, setValue] = useState(editor?.getAttributes("link").href || "");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <Link2 className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="Paste link"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("highlight").color || "#FFFFFF";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <Highlighter className="size-3" />
          <div className="h-1 w-full" style={{ backgroundColor: value }}></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 flex flex-col items-center justify-center shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <div className="size-3 text-xs leading-3">A</div>
          <div className="h-1 w-full" style={{ backgroundColor: value }}></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 flex items-center justify-between shrink-0 hover:bg-neutral-200/80 rounded-sm w-[120px] px-1.5 text-sm">
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDown className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem key={value} asChild>
            <button
              onClick={() => editor?.chain().focus().setFontFamily(value).run()}
              className={cn(
                "hover:bg-neutral-200/80 rounded-sm flex items-center gap-x-2 px-2 py-1 w-full cursor-pointer",
                (editor?.getAttributes("textStyle").fontFamily === value ||
                  (value === "Arial" &&
                    !editor?.getAttributes("textStyle").fontFamily)) &&
                  "bg-neutral-200"
              )}
              style={{ fontFamily: value }}
            >
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    { label: "Normal text", value: 0, fontSize: "1rem", fontWeight: 500 },
    { label: "Heading 1", value: 1, fontSize: "1.5rem", fontWeight: 600 },
    { label: "Heading 2", value: 2, fontSize: "1.4rem", fontWeight: 600 },
    { label: "Heading 3", value: 3, fontSize: "1.3rem", fontWeight: 500 },
    { label: "Heading 4", value: 4, fontSize: "1.2rem", fontWeight: 500 },
    { label: "Heading 5", value: 5, fontSize: "1.1rem", fontWeight: 500 },
    { label: "Heading 6", value: 6, fontSize: "1rem", fontWeight: 500 },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] flex items-center justify-between shrink-0 hover:bg-neutral-200/80 rounded-sm px-1.5 text-sm">
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDown className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {headings.map(({ label, value, fontSize, fontWeight }) => (
          <DropdownMenuItem key={value} asChild>
            <button
              onClick={() => {
                if (value === 0) {
                  editor?.chain().focus().setParagraph().run();
                } else {
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: value as Level })
                    .run();
                }
              }}
              className={cn(
                "hover:bg-neutral-200/80 rounded-sm flex items-center gap-x-2 px-2 py-1 w-full cursor-pointer",
                ((value === 0 && !editor?.isActive("heading")) ||
                  editor?.isActive("heading", { level: value })) &&
                  "bg-neutral-200"
              )}
              style={{ fontSize, fontWeight }}
            >
              {label}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  disabled?: boolean;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-sm h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-300/80",
        isActive && "bg-neutral-200"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export const ToolBar = () => {
  const { editor } = useEditorStore();
  const { setEditor } = useEditorStore();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2,
        onClick: () => editor?.chain().focus().undo().run(),
        disabled: !editor?.can().undo(),
      },
      {
        label: "Redo",
        icon: Redo2,
        onClick: () => editor?.chain().focus().redo().run(),
        disabled: !editor?.can().redo(),
      },
      {
        label: "Print",
        icon: Printer,
        onClick: () => window.print(),
      },
      {
        label: "SpellCheck",
        icon: SpellCheck,
        isActive: editor?.view.dom.spellcheck,
        onClick: () => {
          const current = editor?.view.dom.spellcheck;
          editor?.view.dom.setAttribute(
            "spellcheck",
            current ? "false" : "true"
          );
          setEditor(editor);
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: Bold,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: !!editor?.isActive("bold"),
      },
      {
        label: "Italic",
        icon: Italic,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: !!editor?.isActive("italic"),
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: !!editor?.isActive("underline"),
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlus,
        onClick: () => console.log("TODO: Comment"),
        isActive: false, // TODO: Enable comment
      },
      {
        label: "List Todo",
        icon: ListTodo,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
      {
        label: "Remove Formating",
        icon: RemoveFormatting,
        onClick: () => editor?.commands.unsetAllMarks(),
      },
    ],
  ];

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="bg-neutral-300 h-6" />
      <FontFamilyButton />
      <Separator orientation="vertical" className="bg-neutral-300 h-6" />
      <HeadingButton />
      <Separator orientation="vertical" className="bg-neutral-300 h-6" />
      <FontSizeButton />
      <Separator orientation="vertical" className="bg-neutral-300 h-6" />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightColorButton />
      <Separator orientation="vertical" className="bg-neutral-300 h-6" />
      <LinkButton />
      <ImageButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};
