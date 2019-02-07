import assert from "assert";
import defaultExport, { invariant, InvariantError } from "./invariant";
import reactInvariant from "invariant";

describe("ts-invariant", function () {
  it("should support both named and default exports", function () {
    assert.strictEqual(defaultExport, invariant);
  });

  it("should support very basic usage", function () {
    invariant(true, "ok");
    try {
      invariant(false, "expected");
      throw new Error("unexpected");
    } catch (e) {
      assert.strictEqual(e.message, "expected");
      assert.strictEqual(String(e), "Invariant Violation: expected");
    }
  });

  it("should throw InvariantError instance", function () {
    try {
      invariant(false, "expected");
      throw new Error("unexpected");
    } catch (e) {
      assert.strictEqual(e.message, "expected");
      assert(e instanceof Error);
      assert(e instanceof InvariantError);
      assert.strictEqual(e.name, "Invariant Violation");
      assert.strictEqual(e.framesToPop, 1);
      assert.strictEqual(typeof e.stack, "string");
    }
  });

  it("should behave like the React invariant function", function () {
    let reactError;
    try {
      reactInvariant(false, "oyez");
    } catch (e) {
      reactError = e;
    }
    let ourError;
    try {
      invariant(false, "oyez");
    } catch (e) {
      ourError = e;
    }
    assert.strictEqual(reactError.message, "oyez");
    assert.strictEqual(ourError.message, "oyez");
    assert.deepEqual(reactError, ourError);
    assert.deepEqual(Object.keys(ourError).sort(), [
      "framesToPop",
      "name",
    ]);
  });
});