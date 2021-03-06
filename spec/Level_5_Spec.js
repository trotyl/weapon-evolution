describe('In level 5 ', function () {
    var console, game, player_1, player_2, weapon;

    beforeEach(function () {
        console = {log: null};
        spyOn(console, 'log');

        weapon = new Weapon('优质毒剑', 2, 0, 'medium');
        player_1 = new Player('张三', 10, 8, 'soldier');
        player_2 = new Player('李四', 20, 9, 'normal');
        game = new Game(console, player_1, player_2);
    });

    it('weapon should have effect property', function () {
        expect(weapon.effect).toBeTruthy();
    });

    it('abnormal player should be able to wear shield', function () {
        player_1.setWeapon(weapon);
        expect(player_1.weapon.name).toEqual(weapon.name);
        player_2.setWeapon(weapon);
        expect(player_2.weapon.type).toEqual('null');
    });

    it('assassin can wear short and medium weapon', function () {
        var player = new Player('', 0, 0, 'assassin');
        var short_weapon = new Weapon('short_weapon', 0, 0, 'short');
        var medium_weapon = new Weapon('medium_weapon', 0, 0, 'medium');
        var long_weapon = new Weapon('long_weapon', 0, 0, 'long');
        player.setWeapon(short_weapon);
        expect(player.weapon.name).toEqual('short_weapon');
        player.removeWeapon();
        player.setWeapon(medium_weapon);
        expect(player.weapon.name).toEqual('medium_weapon');
        player.removeWeapon();
        player.setWeapon(long_weapon);
        expect(player.weapon.type).toEqual('null');
    });

    it('soldier can wear medium weapon', function () {
        var player = new Player('', 0, 0, 'soldier');
        var short_weapon = new Weapon('short_weapon', 0, 0, 'short');
        var medium_weapon = new Weapon('medium_weapon', 0, 0, 'medium');
        var long_weapon = new Weapon('long_weapon', 0, 0, 'long');
        player.setWeapon(short_weapon);
        expect(player.weapon.type).toEqual('null');
        player.removeWeapon();
        player.setWeapon(medium_weapon);
        expect(player.weapon.name).toEqual('medium_weapon');
        player.removeWeapon();
        player.setWeapon(long_weapon);
        expect(player.weapon.type).toEqual('null');
    });

    it('knight can wear medium and long weapon', function () {
        var player = new Player('', 0, 0, 'knight');
        var short_weapon = new Weapon('short_weapon', 0, 0, 'short');
        var medium_weapon = new Weapon('medium_weapon', 0, 0, 'medium');
        var long_weapon = new Weapon('long_weapon', 0, 0, 'long');
        player.setWeapon(short_weapon);
        expect(player.weapon.type).toEqual('null');
        player.removeWeapon();
        player.setWeapon(medium_weapon);
        expect(player.weapon.name).toEqual('medium_weapon');
        player.removeWeapon();
        player.setWeapon(long_weapon);
        expect(player.weapon.name).toEqual('long_weapon');
    });

    it('normal one can not wear weapon', function () {
        var player = new Player('', 0, 0, 'normal');
        var short_weapon = new Weapon('short_weapon', 0, 0, 'short');
        var medium_weapon = new Weapon('medium_weapon', 0, 0, 'medium');
        var long_weapon = new Weapon('long_weapon', 0, 0, 'long');
        player.setWeapon(short_weapon);
        expect(player.weapon.type).toEqual('null');
        player.removeWeapon();
        player.setWeapon(medium_weapon);
        expect(player.weapon.type).toEqual('null');
        player.removeWeapon();
        player.setWeapon(long_weapon);
        expect(player.weapon.type).toEqual('null');
    });

    it('long weapon have repel property and can attack with distance 2', function () {
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ repel: true });
        game.distance = 1;
        player_2.doDefence(player_1, game);
        expect(game.distance).toBe(2);
    });

    it('player without attack range must forward first', function () {
        game.distance = 2;
        player_1.doDefence(player_2, game);
        expect(player_1.life).toBe(10);
        expect(game.distance).toBe(1);
        player_1.doDefence(player_2, game);
        expect(player_1.life).toBe(1);
        expect(game.distance).toBe(1);
    });

    it('knight can both forward and attack', function () {
        var player = new Player('', 10, 2, 'knight');
        game.distance = 2;
        player_1.doDefence(player, game);
        expect(player_1.life).toBe(8);
        expect(game.distance).toBe(1);
    });

    it('double attack could cause double attack', function () {
        player_1.setWeapon(weapon);
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ double: true });
        player_2.doDefence(player_1, game);
        expect(player_2.life).toBe(0);
    });

    it('weapon defence will cause the attack hurt', function () {
        weapon.defence = 2;
        player_1.setWeapon(weapon);
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ defence: true });
        player_1.doDefence(player_2, game);
        expect(player_2.life).toBe(18);
    });

    it('only assassin could activate double effect', function () {

    });

    it('only soldier could activate defence effect', function () {

    });

    it('only soldier could activate repel effect', function () {

    });

    it('game should output right when in double effect', function () {
        weapon = new Weapon('峨眉刺', 2, 0, 'short');
        player_1 = new Player('张三', 10, 8, 'assassin', weapon);
        player_2 = new Player('李四', 20, 9, 'knight');
        game.setPlayerA(player_1);
        game.setPlayerB(player_2);
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ double: true });
        game.play();
        expect(console.log).toHaveBeenCalledWith('刺客张三用峨眉刺攻击了骑士李四, 李四受到了10点伤害, 张三发动了连击, 李四受到了10点伤害, 李四剩余生命：0');
    });

    it('game should output right when in double effect with extra damage', function () {
        weapon = new Weapon('冰雪峨眉刺', 0, 0, 'short');
        player_1 = new Player('张三', 10, 8, 'assassin', weapon);
        player_2 = new Player('李四', 20, 9, 'knight');
        game.setPlayerA(player_1);
        game.setPlayerB(player_2);
        spyOn(player_1.weapon, 'getExtraDamage').and.returnValue(new ExtraDamage('frozen'));
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ double: true });
        game.play();
        expect(console.log).toHaveBeenCalledWith('刺客张三用冰雪峨眉刺攻击了骑士李四, 李四受到了8点伤害, 李四冻僵了, 张三发动了连击, 李四受到了8点伤害, 李四剩余生命：4');
    });

    it('game should output right when in repel effect', function () {
        weapon = new Weapon('长枪', 0, 0, 'long');
        player_1 = new Player('张三', 10, 8, 'knight', weapon);
        player_2 = new Player('李四', 20, 9, 'assassin');
        game.setPlayerA(player_1);
        game.setPlayerB(player_2);
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ repel: true });
        game.play();
        expect(console.log).toHaveBeenCalledWith('骑士张三用长枪攻击了刺客李四, 李四受到了8点伤害, 李四被击退了, 李四剩余生命：12');
        expect(console.log).toHaveBeenCalledWith('李四靠近了张三.');
    });

    it('game should output right when in defence effect', function () {
        weapon_1 = new Weapon('长枪', 0, 0, 'long');
        weapon_2 = new Weapon('未命名', 0, 0, 'medium');
        player_1 = new Player('张三', 10, 8, 'knight', weapon_1);
        player_2 = new Player('李四', 20, 9, 'soldier', weapon_2);
        game.setPlayerA(player_1);
        game.setPlayerB(player_2);
        spyOn(player_1.weapon, 'getEffect').and.returnValue({ defence: true });
        game.play();
        expect(console.log).toHaveBeenCalledWith('骑士张三用长枪攻击了战士李四, 李四受到了8点伤害, 李四发动了隔挡反击, 张三受到了9点伤害, 李四剩余生命：12, 张三剩余生命：10');
    });

});
