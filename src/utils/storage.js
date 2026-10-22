export const getJSON = (
    key,
    fallback
) => {

    try {

        const value =
            localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;

    } catch {

        return fallback;

    }

};


export const setJSON = (
    key,
    value
) => {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

};


export const addHistory = (
    action,
    status = "Completed"
) => {

    const history =
        getJSON(
            "toolery_history",
            []
        );


    history.unshift({

        action,

        status,

        date:
            new Date()
                .toLocaleDateString("en-IN")

    });


    setJSON(
        "toolery_history",
        history.slice(0, 30)
    );

};


export const addFile = (
    file,
    status = "Completed"
) => {

    if (!file) {
        return;
    }


    const files =
        getJSON(
            "toolery_files",
            []
        );


    files.unshift({

        name: file.name,

        type:
            file.type || "File",

        status,

        date:
            new Date()
                .toLocaleDateString("en-IN"),

        size: file.size

    });


    setJSON(
        "toolery_files",
        files.slice(0, 50)
    );

};


export const downloadBlob = (
    blob,
    filename
) => {

    const link =
        document.createElement("a");

    const url =
        URL.createObjectURL(blob);


    link.href = url;

    link.download = filename;


    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(() => {

        URL.revokeObjectURL(url);

    }, 1000);

};