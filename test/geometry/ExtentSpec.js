describe('ExtentSpec', function () {

    var container;
    var map;
    var center = new maptalks.Coordinate(118.846825, 32.046534);

    beforeEach(function () {
        var setups = COMMON_CREATE_MAP(center);
        container = setups.container;
        map = setups.map;
    });

    afterEach(function () {
        map.remove();
        REMOVE_CONTAINER(container);
    });

    describe('extent constructor', function () {
        //verify extent instance
        function verify(extent) {
            expect(extent['xmin']).to.be(1);
            expect(extent['ymin']).to.be(2);
            expect(extent['xmax']).to.be(3);
            expect(extent['ymax']).to.be(4);
        }

        it('has 2 constructors', function () {
            //constructor 1
            var extent = new maptalks.Extent(1, 2, 3, 4);
            verify(extent);

            extent = new maptalks.Extent(3, 4, 1, 2);
            verify(extent);

            //constructor 2
            extent = new maptalks.Extent(new maptalks.Coordinate(1, 2), new maptalks.Coordinate(3, 4));
            verify(extent);

            extent = new maptalks.Extent(new maptalks.Coordinate(3, 4), new maptalks.Coordinate(1, 2));
            verify(extent);
        });
    });


    describe('extent instance methods', function () {
        it('is valid', function () {
            var extent = new maptalks.Extent(1, 2, 3, 4);
            expect(extent.isValid()).to.be.ok();

            var extent2 = new maptalks.Extent(NaN, 2, 3, 4);
            expect(extent2.isValid()).to.not.be.ok();


        });

        it('is invalid', function () {
            var extent = new maptalks.Extent();
            expect(extent.isValid()).to.not.be.ok();

            extent = new maptalks.Extent(null, 2, 3, 4);
            expect(extent.isValid()).to.not.be.ok();

            extent = new maptalks.Extent(undefined, 2, 3, 4);
            expect(extent.isValid()).to.not.be.ok();
        });

        it('equals', function () {
            var extent = new maptalks.Extent(1, 2, 3, 4);
            expect(extent.equals(new maptalks.Extent(1, 2, 3, 4))).to.be.ok();
            expect(extent.equals(new maptalks.Extent(2, 2, 4, 4))).to.not.be.ok();

            //2 empty extents are equal
            extent = new maptalks.Extent();
            expect(extent.equals(new maptalks.Extent())).to.be.ok();
        });

        it('toJSON', function () {
            var ext1 = new maptalks.Extent(1, 2, 3, 4);
            var json = ext1.toJSON();
            expect(json).to.eql({
                'xmin':1,
                'ymin':2,
                'xmax':3,
                'ymax':4
            });
        });

        it('intersects', function () {
            var ext1 = new maptalks.Extent(1, 1, 4, 4);

            expect(ext1.intersects(new maptalks.Extent(2, 2, 3, 3))).to.be.ok();
            expect(ext1.intersects(new maptalks.Extent(20, 20, 30, 30))).to.not.be.ok();

        });

        it('intersects2', function () {
            var e1 = new maptalks.Extent(1, 1, 5, 5);
            var e2 = new maptalks.Extent(2, 2, 6, 6);

            expect(e1.intersects(e2)).to.be.ok();
        });

        it('contains', function () {
            var ext1 = new maptalks.Extent(1, 1, 4, 4);

            expect(ext1.contains(new maptalks.Point(2, 2))).to.be.ok();
            expect(ext1.contains(new maptalks.Point(20, 20))).to.not.be.ok();
        });

    });


    describe('extent static methods', function () {

        it('combines', function () {
            var ext1 = new maptalks.Extent(1, 1, 2, 2);
            var ext2 = new maptalks.Extent(2, 2, 4, 4);

            var combined = ext1.combine(ext2);

            expect(combined.equals(new maptalks.Extent(1, 1, 4, 4))).to.be.ok();

            var combined2 = ext1.combine(new maptalks.Extent());
            expect(combined2.equals(ext1)).to.be.ok();
        });

        it('expand', function () {
            var ext = new maptalks.Extent(1, 2, 3, 4);
            var expanded = ext.expand(10);
            expect(expanded.equals(new maptalks.Extent(-9, -8, 13, 14))).to.be.ok();

            expanded = ext.expand(0);
            expect(expanded.equals(ext)).to.be.ok();

            var empty = new maptalks.Extent();
            expanded = empty.expand(1);
            expect(expanded.equals(new maptalks.Extent(-1, -1, 1, 1))).to.be.ok();
        });

        it('static.combine', function () {
            var e1 = new maptalks.Extent(2, 2, 5, 5);
            var e2 = new maptalks.Extent(3, 3, 6, 6);
            var combined = e1.combine(e2);

            expect(combined.xmin).to.eql(2);
            expect(combined.ymin).to.eql(2);
            expect(combined.xmax).to.eql(6);
            expect(combined.ymax).to.eql(6);
        });

        it('static.expand', function () {
            var extent = new maptalks.Extent(2, 2, 6, 6);
            var e1 = extent.expand(1);
            var e2 = extent.expand(-2);

            expect(e1.xmin).to.eql(1);
            expect(e1.ymin).to.eql(1);
            expect(e1.xmax).to.eql(7);
            expect(e1.ymax).to.eql(7);

            expect(e2.xmin).to.eql(4);
            expect(e2.ymin).to.eql(4);
            expect(e2.xmax).to.eql(4);
            expect(e2.ymax).to.eql(4);
        });
    });

});
