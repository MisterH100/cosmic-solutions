const time = 30000;

export const getReports = async (url: string) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => { controller.abort() }, time);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      signal
    });

    const content = await response.json();
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.log(error)
    let abort: boolean;
    console.log(error)
    if (error.name === 'AbortError') {
      abort = true
    } else {
      abort = false
    }
    return { ok: false, abort: abort, content: { message: error } }
  }

}

export const getReportByID = async (url: string) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => { controller.abort() }, time);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      signal
    });

    const content = await response.json();
    clearTimeout(timeoutId)
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.log(error)
    let abort: boolean;
    console.log(error)
    if (error.name === 'AbortError') {
      abort = true
    } else {
      abort = false
    }
    return { ok: false, abort: abort, content: { message: error } }
  }

}

export const getUserReports = async (url: string, data: any) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => { controller.abort() }, time);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
      signal
    });

    const content = await response.json();
    clearTimeout(timeoutId)
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.log(error)
    let abort: boolean;
    console.log(error)
    if (error.name === 'AbortError') {
      abort = true
    } else {
      abort = false
    }
    return { ok: false, abort: abort, content: { message: error } }
  }

}


export const createReport = async (url: string, data: any) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => { controller.abort() }, time);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
      signal
    });

    const content = await response.json();
    clearTimeout(timeoutId)
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    let abort: boolean;
    console.log(error)
    if (error.name === 'AbortError') {
      abort = true
    } else {
      abort = false
    }
    return { ok: false, abort: abort, content: { message: error } }
  }

}
