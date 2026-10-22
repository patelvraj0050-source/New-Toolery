export const loadScript = (
    url,
    globalName
) => {

    if (
        globalName &&
        window[globalName]
    ) {

        return Promise.resolve(
            window[globalName]
        );

    }


    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement(
                    "script"
                );


            script.src = url;


            script.onload = () => {

                resolve(
                    globalName
                        ? window[globalName]
                        : true
                );

            };


            script.onerror = () => {

                reject(
                    new Error(
                        "Could not load required library."
                    )
                );

            };


            document.head.appendChild(
                script
            );

        }
    );
};


export const readImage = (
    file
) => {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            image.onload = () => {

                resolve(image);

            };


            image.onerror = reject;


            image.src =
                URL.createObjectURL(file);

        }
    );
};


export const formatBytes = (
    bytes
) => {

    if (!bytes) {
        return "0 B";
    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        bytes /
        1024 ** index
    ).toFixed(
        index ? 1 : 0
    ) +
    " " +
    units[index];
};


export const parsePages = (
    value
) => {

    const pages =
        new Set();


    value
        .split(",")
        .map(
            (part) =>
                part.trim()
        )
        .filter(Boolean)
        .forEach((part) => {

            if (
                part.includes("-")
            ) {

                let [
                    start,
                    end
                ] =
                    part
                        .split("-")
                        .map(Number);


                if (start > end) {

                    [
                        start,
                        end
                    ] =
                        [
                            end,
                            start
                        ];

                }


                for (
                    let page = start;
                    page <= end &&
                    page - start < 500;
                    page++
                ) {

                    if (
                        Number.isInteger(
                            page
                        )
                    ) {

                        pages.add(page);

                    }

                }

            } else {

                const page =
                    Number(part);


                if (
                    Number.isInteger(page)
                ) {

                    pages.add(page);

                }

            }

        });


    return [...pages]
        .sort(
            (a, b) => a - b
        );

};