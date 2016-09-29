!function(global) {
    function flatten(list) {
        return list.reduce(function(acc, item) {
            return acc.concat(Array.isArray(item) ? flatten(item) : item);
        }, []);
    }

    function Middleware(acceptor) {
        this.stack = [];
    
        return Object.setPrototypeOf(function(data, handler) {
            var stack = this.stack.slice();
    
            +function() {
                var item = stack.shift();
                if(item) {
                    acceptor(data, handler, item, arguments.callee);
                }
            }();
        }.bind(this), this);
    }
    
    Object.assign(Middleware.prototype, {
        use: function() {
            this.stack.push.apply(this.stack, flatten(this.stack.slice.call(arguments)));
        },
        kill: function(handler) {
            var index = 0;
    
            if(arguments.length > 1) {
                while(index < arguments.length) {
                    this.remove(arguments[index++]);
                }
                return;
            }
    
            while(~(index = this.stack.indexOf(handler))) {
                this.stack.splice(index, 1);
            }
        }
    });

    if(typeof define === 'function' && define.amd) {
        define(function() {
            return Middleware;
        });
    } else
    if(typeof module !== 'undefined') {
        module.exports = Middleware;
    } else {
        global.Middleware = Middleware;
    }
}(typeof window === 'undefined' ? this : window);