import { None, Some } from "./../src";

describe("Option", () => {
	it("is_some", () => {
		const some = Some(5);
		expect(some.isSome()).toBeTruthy();

		const none = None();
		expect(none.isSome()).toBeFalsy();
	});

	it("is_none", () => {
		const some = Some(5);
		expect(some.isNone()).toBeFalsy();

		const none = None();
		expect(none.isNone()).toBeTruthy();
	});

	it("expect", () => {
		const none = None();
		expect(() => none.expect("some")).toThrowError(new Error("some"));

		const some = Some(5);
		expect(some.expect("some")).toEqual(5);
	});

	it("unwrap on `Some`", () => {
		const [some1, some2, some3] = [
			Some(5),
			Some([1, 3, 4]),
			Some({
				test: 4,
			}),
		];

		expect(some1.unwrap()).toEqual(5);
		expect(some2.unwrap()).toEqual([1, 3, 4]);
		expect(some3.unwrap()).toEqual({
			test: 4,
		});
	});

	it("unwrap on `None`", () => {
		const none = None();

		expect(none.unwrap).toThrow(TypeError);
	});

	it("unwrapOr on `Some`", () => {
		const some = Some({
			test: true,
		});

		expect(some.unwrapOr({ test: false })).toEqual({
			test: true,
		});
	});

	it("unwrapOr on `None`", () => {
		const none = None();

		expect(none.unwrapOr({ test: false })).toEqual({
			test: false,
		});
	});

	it("unwrapOrElse on `Some`", () => {
		const some = Some("SOME");

		expect(some.unwrapOrElse(() => "NONE")).toEqual("SOME");
	});

	it("unwrapOrElse on `None`", () => {
		const none = None();

		expect(none.unwrapOrElse(() => "NONE")).toEqual("NONE");
	});

	it("`map` on `Some`", () => {
		const some = Some({ isSome: true });

		const mappedSome = some.map((item) => ({
			data: !item.isSome,
		}));

		expect(mappedSome.unwrap()).toEqual({
			data: false,
		});
	});

	it("`mapOr` on `Some` and None", () => {
		const defaultStatus: number = 500;

		const some = Some({ status: 200 });
		const mappedSome = some.mapOr(defaultStatus, (data) => data.status);
		expect(mappedSome).toEqual(200);

		const none = None();
		const mappedNone = none.mapOr(defaultStatus, (data) => data.status);
		expect(mappedNone).toEqual(500);
	});

	it("`mapOrElse` on `Some` and None", () => {
		const defaultStatus: number = 500;

		const some = Some({ status: 200 });
		const mappedSome = some.mapOrElse(
			() => defaultStatus,
			(data) => data.status,
		);
		expect(mappedSome).toEqual(200);

		const none = None();
		const mappedNone = none.mapOrElse(
			() => defaultStatus,
			(data) => data.status,
		);
		expect(mappedNone).toEqual(500);
	});

	it("andThen", () => {
		const some = Some(25);
		const sq = (x: number) => Some(x * x);

		// 25 * 25 => 625 + 5 => 630
		const result = some.andThen(sq).andThen((x) => Some(x + 5));
		expect(result.unwrap()).toEqual(630);
	});

	it("`filter`", () => {
		const some = Some({ status: 200 });

		const result = some
			.filter((item) => item.status === 200)
			.map((_) => "Ok")
			.unwrapOr("Error");

		expect(result).toEqual("Ok");

		const someNumber = Some(200);
		expect(someNumber.filter((item) => item === 200).unwrapOr(500)).toEqual(
			200,
		);
	});

	it("replace", () => {
		const some = Some(50);

		expect(some.unwrap()).toEqual(50);

		const oldSome = some.replace(250);

		expect(oldSome.unwrap()).toEqual(50);
		expect(some.unwrap()).toEqual(250);
	});
});
