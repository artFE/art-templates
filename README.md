## Template name

base_h5

## Scope of application

Project template in MVC development mode for h5.

## Advantages

- Support command line to directly publish uploads
- Automatically complete the css prefix
- Provide Utils tool methods, including loading and toast

## Usage

1. install

    ```Bash
    npm install
    ```

    > If you have previously installed it globally, you can skip it.

2. build

    ```Bash
    gulp buildmdemo // Publish to the demo directory configured in `config.json`
    gulp builddemo // Publish to the demo directory configured in `config.json` width compress
    gulp buildmcdn // Publish to the cdn directory configured in `config.json`
    gulp buildcdn // Publish to the cdn directory configured in `config.json` width compress
    ```

3. Utils

    - Utils.formatTime(Date, format)
    - Utils.getBrowserInfo()
    - Utils.getCookie(name)
    - Utils.getUrlString(name)
    - Utils.pageLock()
    - Utils.pageUnlock()
    - Utils.showToast(text)
    - Utils.hideToast()
    - Utils.showLoading()
    - Utils.hideLoading()

## Author

McChen<mcchen.club@gmail.com>

## License

MIT
