/**
 * ============================================================================
 * DUMMY / DEMONSTRATION FILE: JavaScript — Promises vs Callbacks
 * Topic: JavaScript — Promises vs callbacks (0.1 pts • Frontend)
 * Project: PantryPal Smart Kitchen Management System
 * ============================================================================
 * 
 * This file presents a side-by-side comparison of asynchronous patterns in JavaScript:
 * 1. Traditional Node.js error-first Callback pattern
 * 2. The "Callback Hell" (Pyramid of Doom) problem
 * 3. Promisification: Wrapping callbacks into Promises
 * 4. Promise Chaining (.then, .catch, .finally)
 * 5. Modern ES2017+ async/await syntax
 * 6. Parallel execution using Promise.all
 */

// Simulated async database/API operations using setTimeout

/**
 * 1. Callback-based simulated asynchronous operations
 */
export const fetchUserCallback = (userId, callback) => {
  setTimeout(() => {
    if (!userId) {
      return callback(new Error("User ID is required"), null);
    }
    callback(null, { id: userId, name: "Tanushree", email: "tanushree@example.com" });
  }, 200);
};

export const fetchPantryCallback = (userId, callback) => {
  setTimeout(() => {
    if (!userId) {
      return callback(new Error("Pantry lookup requires valid userId"), null);
    }
    callback(null, { id: "pantry-101", name: "Main Kitchen Pantry", userId });
  }, 200);
};

export const fetchItemsCallback = (pantryId, callback) => {
  setTimeout(() => {
    if (!pantryId) {
      return callback(new Error("Items lookup requires valid pantryId"), null);
    }
    callback(null, [
      { id: "item-1", name: "Olive Oil", quantity: 500, unit: "ml" },
      { id: "item-2", name: "Pasta", quantity: 2, unit: "packs" },
    ]);
  }, 200);
};

/**
 * 2. Demonstration: "Callback Hell" / Pyramid of Doom
 * Hard to read, inverted control flow, duplicated error handlers.
 */
export const runCallbackHellFlow = (userId, onLog, onComplete) => {
  onLog("Step 1: Initiating fetchUserCallback...");
  fetchUserCallback(userId, (err1, user) => {
    if (err1) {
      return onComplete(err1, null);
    }
    onLog(`Step 2: User found (${user.name}). Initiating fetchPantryCallback...`);

    fetchPantryCallback(user.id, (err2, pantry) => {
      if (err2) {
        return onComplete(err2, null);
      }
      onLog(`Step 3: Pantry found (${pantry.name}). Initiating fetchItemsCallback...`);

      fetchItemsCallback(pantry.id, (err3, items) => {
        if (err3) {
          return onComplete(err3, null);
        }
        onLog(`Step 4: Retrieved ${items.length} items successfully via nested callbacks!`);
        onComplete(null, { user, pantry, items });
      });
    });
  });
};

/**
 * 3. Promisification: Converting Callback functions into Promise-returning functions
 */
export const promisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

export const fetchUserPromise = promisify(fetchUserCallback);
export const fetchPantryPromise = promisify(fetchPantryCallback);
export const fetchItemsPromise = promisify(fetchItemsCallback);

/**
 * 4. Demonstration: Promise Chaining (.then / .catch / .finally)
 * Flattens the hierarchy, single unified error handler.
 */
export const runPromiseChainFlow = (userId, onLog) => {
  onLog("Step 1: Starting Promise Chain with fetchUserPromise...");
  let context = {};

  return fetchUserPromise(userId)
    .then((user) => {
      context.user = user;
      onLog(`Step 2: User resolved (${user.name}). Chaining fetchPantryPromise...`);
      return fetchPantryPromise(user.id);
    })
    .then((pantry) => {
      context.pantry = pantry;
      onLog(`Step 3: Pantry resolved (${pantry.name}). Chaining fetchItemsPromise...`);
      return fetchItemsPromise(pantry.id);
    })
    .then((items) => {
      context.items = items;
      onLog(`Step 4: All ${items.length} items resolved cleanly via Promise Chaining!`);
      return context;
    })
    .catch((error) => {
      onLog(`Promise Chain Error caught: ${error.message}`);
      throw error;
    });
};

/**
 * 5. Demonstration: Modern async / await with try / catch
 * Synchronous-looking code, native call stack preservation.
 */
export const runAsyncAwaitFlow = async (userId, onLog) => {
  try {
    onLog("Step 1: Awaiting fetchUserPromise...");
    const user = await fetchUserPromise(userId);

    onLog(`Step 2: User resolved (${user.name}). Awaiting fetchPantryPromise...`);
    const pantry = await fetchPantryPromise(user.id);

    onLog(`Step 3: Pantry resolved (${pantry.name}). Awaiting fetchItemsPromise...`);
    const items = await fetchItemsPromise(pantry.id);

    onLog(`Step 4: Successfully resolved all data with async/await!`);
    return { user, pantry, items };
  } catch (error) {
    onLog(`Caught error in async/await: ${error.message}`);
    throw error;
  }
};
