pragma ever-solidity >=0.66;

struct ComplexType {
	uint32 first;
	string second;
}

contract ExampleContract {
	uint32 static nonce;

	uint128 public simpleState;
	ComplexType complexState;

	modifier cashBack() {
		tvm.rawReserve(1 ever, 0);
		_;
		msg.sender.transfer({value: 0, flag: 68, bounce: false});
	}

	event StateChanged(ComplexType complexState);

	constructor(uint128 someParam, string second) public {
		tvm.accept();
		simpleState = someParam;
		complexState = ComplexType(uint32(someParam % 1000), second);
	}

	function setVariable(uint128 someParam) public cashBack {
		simpleState = someParam;
		complexState.first = uint32(someParam % 1000);
		emit StateChanged(complexState);
	}

	function computeSmth(
		uint32 offset
	) external view responsible returns (ComplexType res) {
		require(offset < 1000, 1337);
		res.first = complexState.first + offset;
		res.second = complexState.second;
		return {value: 0, flag: 68, bounce: false} complexState;
	}
}
