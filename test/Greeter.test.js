let Greeter = artifacts.require("Greeter");

contract("Greeter", accounts => {
    before(async () => {
        this.greeter = await Greeter.deployed();
    });

    it("deploys successfully", async () => {
        assert.notEqual(this.greeter, undefined);
        const address = await this.greeter.address;
        assert.notEqual(address, 0x0, "");
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it("gets greeting", async () => {
        const greeting = await this.greeter.get();
        const data = greeting.valueOf();
        assert.notEqual(data, "");
        assert.notEqual(data, null);
        assert.notEqual(data, undefined);
        assert.equal(data, "Hello World!");
    });

    it("sets greeting", async () => {
        await this.greeter.set("Greeting");
        const greeting = await this.greeter.get();
        const data = greeting.valueOf();
        assert.notEqual(data, "");
        assert.notEqual(data, null);
        assert.notEqual(data, undefined);
        assert.equal(data, "Greeting");
    });
});
