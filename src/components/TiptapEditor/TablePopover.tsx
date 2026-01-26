import { useState, memo } from "react";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from "@/components/ui/popover";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function TablePopover({editor, children}) {
    const [showTablePopover, setShowTablePopover] = useState(false)

    const tableSchema = z.object({
    rows: z.coerce.number().min(1, {message:'Rows cannot be less then 1'}).max(20, {message: "Rows must be less then 20"}).positive(),
    cols: z.coerce.number().min(1, {message:'Columns cannot be less then 1'}).max(20, {message: "Colunm must be less then 20"}).positive(),
    withHeaderRow: z.boolean(),
  })
  
  const tableForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues:{
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    },
  })
  
  const insertTable = (value)=>{
    editor.chain().insertTable(value).run()
    setShowTablePopover(false)
    tableForm.reset()
  }
    
    return (
            <Popover
                open={showTablePopover}
                onOpenChange={() => {
                    tableForm.reset();
                    setShowTablePopover(!showTablePopover);
                }}
            >
              <PopoverTrigger asChild>
                {children}
              </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>
                        <PopoverTitle>Insert Table</PopoverTitle>
                    </PopoverHeader>
                    <Form {...tableForm}>
                        <form
                            onSubmit={tableForm.handleSubmit(insertTable)}
                            className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={tableForm.control}
                                name="rows"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rows</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={tableForm.control}
                                name="cols"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Columns</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            </div>
                            <div className="flex items-center space-x-2">
                               <FormField
                                control={tableForm.control}
                                name="withHeaderRow"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                          <Switch
                                            id="headers"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Label htmlFor="headers">Insert Headers</Label>
                            </div>
                            <div className="mt-4 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setShowTablePopover(false)
                                          tableForm.reset()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                <Button type="submit">Insert</Button>
                            </div>
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
    );
}


export default memo(TablePopover)
