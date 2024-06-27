import { Fragment, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function BreadPath({ path } : { path: string[] }) {
    const [ links, setLinks ] = useState<string[]>([]);

    useEffect(() => {
        setLinks(() => {
            const newPath = [ "http://localhost:3000", ...path.slice(1) ];
            // console.log(newPath);
            const newLinks: string[] = [];

            for ( let i = 0 ; i < newPath.length ; i++ )  {
                newLinks.push(newPath.slice(0, i+1).join("/"));
            }
            // console.log(newLinks);
            return newLinks;
        })
    }, [ ]);

    return (
        <Breadcrumb className="mt-5 w-full items-start p-7 px-20 text-xl">
            <BreadcrumbList>
                {path.map((bit, i) => {
                    return i === path.length - 1 ? (
                        <BreadcrumbItem className="text-xl" key={i}>
                            <BreadcrumbPage>{bit}</BreadcrumbPage>
                        </BreadcrumbItem>
                    ) : (
                        <Fragment key={i}>
                            <BreadcrumbItem className="text-xl">
                                <BreadcrumbLink href={links[i]}>{bit}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}